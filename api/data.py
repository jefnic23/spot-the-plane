import random
import time

import requests
from sqlalchemy import func

from api.app import db
from api.models import Aircraft, Quote

# planespotters.net api
BASE_URL = 'https://api.planespotters.net/pub/photos/reg/'
HEADERS  = {'user-agent': 'spottheplane'}


# weights applied to each model
models = {
    '737'    : 0.886,
    'A320'   : 0.837,
    'Learjet': 0.76,
    '777'    : 0.745,
    'A330'   : 0.726,
    'CRJ'    : 0.722,
    'Dash 8' : 0.69,
    '767'    : 0.683,
    '757'    : 0.682,
    'ERJ 190': 0.661,
    '787'    : 0.597,
    'ERJ 170': 0.588,
    '747'    : 0.586,
    'ERJ 140': 0.559,
    'MD-80'  : 0.538,
    'C-130'  : 0.537,
    'A350'   : 0.502,
    'A380'   : 0.484,
    'DC-3'   : 0.458,
    'A340'   : 0.453,
    'MD-11'  : 0.427,
    '727'    : 0.384,
    'ERJ 135': 0.379
}


def get_planes(seed, models=models):
    random.seed(seed)
    return random.choices(list(models.keys()), weights=list(models.values()), k=10)


def get_answers(seed, plane, models=models):
    random.seed(seed)
    return random.sample([{'model': model, 'answer': False} for model in list(models.keys()) if model != plane and model[:3] != plane[:3]], k=3)


def shuffle_planes(seed, data):
    random.seed(seed)
    return random.sample(data, len(data)) 


def get_chaos(seed):
    return 3.9 * seed * (1 - seed)


def call_api(plane, base_url=BASE_URL, headers=HEADERS):
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
            db.session.commit()

            return False


def get_quote():
    num_rows = db.session.execute(db.select(func.count(Quote.index))).scalar_one()
    id = random.randint(0, num_rows)
    query = db.session.execute(db.select(Quote).where(Quote.index == id)).scalar_one()
    return {'quote': query.quote, 'author': query.author}


def create_game(seed):
    plane_types = get_planes(seed) # Counter?

    data = []
    images = []
    used = []
    chaos_seed = seed / 100000000
    for ptype in plane_types:
        details = False
        while not details:
            random.seed(seed)
            plane = random.choice(db.session.execute(db.select(Aircraft).where(Aircraft.typecode == ptype, Aircraft.viable == True, Aircraft.registration not in used)).scalars().all())
            details = call_api(plane) 
            time.sleep(random.uniform(0.13, 0.55))    # how low can this be to avoid 429 error?
        used.append(plane.registration)
        images.append(details['pic'])
        question = [{'id': plane.registration, 'model': plane.typecode, 'answer': True, 'details': details}]
        answers = get_answers(chaos_seed, plane.typecode)
        question.extend(answers)
        data.append(shuffle_planes(chaos_seed, question))
        chaos_seed = get_chaos(chaos_seed)

    return {'data': shuffle_planes(seed, data), 'images': images, 'day': seed}
    