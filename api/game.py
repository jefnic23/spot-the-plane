import random
import time

import requests
from database import db
from models import Aircraft, Quote
from sqlalchemy import func
from sqlalchemy.future import select


async def get_quote(seed):
    '''Grabs a quote from the database.'''
    num_rows = await db.execute(select(func.count(Quote.index))).scalar_one()
    random.seed(seed)
    id = random.randint(0, num_rows)
    query = await db.execute(select(Quote).where(Quote.index == id)).scalar_one()
    return {'quote': query.quote, 'author': query.author}


class Game:
    # weights applied to each model
    MODELS = {
        '737'    : 0.889,
        'A320'   : 0.853,
        'Learjet': 0.828,
        '777'    : 0.811,
        'A330'   : 0.698,
        'CRJ'    : 0.665,
        'Dash 8' : 0.623,
        '767'    : 0.604,
        '757'    : 0.591,
        'ERJ 190': 0.575,
        '787'    : 0.572,
        'ERJ 170': 0.556,
        '747'    : 0.528,
        'ERJ 140': 0.517,
        'MD-80'  : 0.481,
        'C-130'  : 0.387,
        'A350'   : 0.355,
        'A380'   : 0.347,
        'DC-3'   : 0.322,
        'A340'   : 0.309,
        'MD-11'  : 0.287,
        '727'    : 0.262,
        'ERJ 135': 0.224
    }

    # planespotters.net api
    BASE_URL = 'https://api.planespotters.net/pub/photos/reg/'
    HEADERS  = {'user-agent': 'spottheplane'}

    # create a new game instance
    def __init__(self, seed):
        self.seed = seed
        self.chaos_seed = seed / 100000000
        self.data = []
        self.images = []
        self.used = []    
        self.planes = self.get_planes()

    # initialize the game by selecting ten planes at random
    def get_planes(self):
        random.seed(self.seed)
        return random.choices(list(self.MODELS.keys()), weights=list(self.MODELS.values()), k=10)

    # for each plane in the game, grab three different planes as incorrect answers
    def get_answers(self, plane):
        random.seed(self.chaos_seed)
        return random.sample([{'model': model, 'answer': False} for model in list(self.MODELS.keys()) if model != plane and model[:3] != plane[:3]], k=3)

    # shuffle the set of answers in a question
    def shuffle(self, data, chaos=True):
        # determine which seed to use
        seed = self.chaos_seed if chaos else self.seed
        random.seed(seed)
        return random.sample(data, len(data)) 

    # generate a new seed
    def new_seed(self):
        return 3.9 * self.chaos_seed * (1 - self.chaos_seed)

    # make call to planespotters.net
    async def call_api(self, plane: Aircraft, base_url=BASE_URL, headers=HEADERS):
        url = f'{base_url}{plane.registration}'
        res = requests.get(url, headers=headers)
        if res.status_code not in [200, 201]:
            res.raise_for_status()
        else:
            if res.json()['photos']:
                data = res.json()['photos'][0]
                pic = data['thumbnail_large']['src']
                link = data['link']
                photog = data['photographer']
                return {
                    "pic": pic,
                    "link": link,
                    "copyright": f'\u00a9 {photog}'
                }
            else:
                # planespotters.net has no pics of this plane; mark it as non-viable
                plane.viable = False
                await db.commit()

                return False

    # create the game
    async def create_game(self):
        # loop through the planes in the game, checking for image validity
        async with db.session() as session:
            for plane_type in self.planes:
                details = False
                while not details:
                    random.seed(self.seed)
                    # get a random plane from the database that hasn't already been added to the game
                    query = await session.execute(select(Aircraft).filter_by(typecode=plane_type, viable=True).where(~Aircraft.registration.in_(self.used)))
                    plane = random.choice(query.scalars().all())
                    details = await self.call_api(plane) 
                    time.sleep(random.uniform(0.21, 0.55))

                # add plane to the game
                self.used.append(plane.registration)
                self.images.append(details['pic'])

                # get three more planes as incorrect answers
                question = [{
                    'id': plane.registration, 
                    'model': plane.typecode, 
                    'answer': True, 
                    'details': details
                }]
                answers = self.get_answers(plane.typecode)

                # add question to game
                question.extend(answers)
                self.data.append(self.shuffle(question))

                # create a new seed
                self.chaos_seed = self.new_seed()

            return {
                'data': self.shuffle(self.data, chaos=False), 
                'images': self.images, 
                'day': self.seed
            }
