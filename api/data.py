import random
import time
from collections import Counter

import requests
from sqlalchemy import func

from api.app import db
from api.models import Aircraft, Quote

# weights applied to each model
models = {
    '737'    : 0.875,
    'A320'   : 0.813,
    'Learjet': 0.768,
    '777'    : 0.726,
    'E-Jet'  : 0.72,
    'CRJ'    : 0.702,
    'A330'   : 0.679,
    'Dash 8' : 0.678,
    '767'    : 0.661,
    '757'    : 0.616,
    '787'    : 0.568,
    '747'    : 0.558,
    'ERJ'    : 0.548,
    'MD-80'  : 0.516,
    'C-130'  : 0.497,
    'A350'   : 0.47,
    'A380'   : 0.447,
    'DC-3'   : 0.436,
    'A340'   : 0.39,
    'MD-11'  : 0.371,
    '727'    : 0.344
}


def get_planes(seed, models=models):
    random.seed(seed)
    return random.choices(list(models.keys()), weights=list(models.values()), k=10)


def get_answers(seed, plane, models=models):
    random.seed(seed)
    return random.sample([{'model': p, 'answer': False} for p in list(models.keys()) if p != plane], k=3)


def shuffle_planes(seed, data):
    random.seed(seed)
    return random.sample(data, len(data)) 


def get_chaos(seed):
    return 3.9 * seed * (1 - seed)


# planespotters.net api
BASE_URL = 'https://api.planespotters.net/pub/photos/reg/'
HEADERS  = {'user-agent': 'spottheplane'}


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

            return {'pic': False}


def get_quote():
    num_rows = db.session.execute(db.select(func.count(Quote.index))).scalar_one()
    id = random.randint(0, num_rows)
    query = db.session.execute(db.select(Quote).where(Quote.index == id)).scalar_one()
    return {'quote': query.quote, 'author': query.author}


def create_game(seed):
    plane_types = Counter(get_planes(seed))

    while True:
        data = []
        images = []
        chaos_seed = seed / 100000000
        for ptype in plane_types:
            random.seed(seed)
            p = random.sample(db.session.execute(db.select(Aircraft).where(Aircraft.typecode == ptype, Aircraft.viable == True)).scalars().all(), k=plane_types[ptype])
            for plane in p:
                details = call_api(plane)
                images.append(details['pic'])
                question = [{'id': plane.registration, 'model': plane.typecode, 'answer': True, 'details': details}]
                answers = get_answers(chaos_seed, plane.typecode)
                for a in answers:
                    question.append(a)
                data.append(shuffle_planes(chaos_seed, question))
                chaos_seed = get_chaos(chaos_seed)
                time.sleep(random.uniform(0.13, 0.34))    # how low can this be to avoid 429 error?
        if len([image for image in images if image]) == 10:
            break

    return shuffle_planes(seed, data), images
    