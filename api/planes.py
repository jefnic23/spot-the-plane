import random
import time
from collections import Counter

import requests

from api.models import Aircraft

# weights applied to each model
models = {
    '737'    : 0.865,
    'A320'   : 0.846,
    'Learjet': 0.79,
    '777'    : 0.758,
    'E-Jet'  : 0.739,
    'CRJ'    : 0.707,
    'A330'   : 0.697,
    'Dash 8' : 0.673,
    '767'    : 0.602,
    '757'    : 0.586,
    '787'    : 0.551,
    '747'    : 0.535,
    'ERJ'    : 0.519,
    'MD-80'  : 0.508,
    'C-130'  : 0.503,
    'A350'   : 0.478,
    'A380'   : 0.473,
    'DC-3'   : 0.47,
    'A340'   : 0.424,
    'MD-11'  : 0.41,
    '727'    : 0.405,
    '707'    : 0.341
}


def get_planes(seed, models=models):
    random.seed(seed)
    return random.choices(list(models.keys()), weights=list(models.values()), k=10)


def get_answers(seed, plane, models=models):
    random.seed(seed)
    return random.sample([[False, p] for p in list(models.keys()) if p != plane], k=3)


def shuffle_planes(seed, data):
    random.seed(seed)
    return random.sample(data, len(data)) 


def get_chaos(seed):
    return 3.9 * seed * (1 - seed)


# planespotters.net api
BASE_URL = 'https://api.planespotters.net/pub/photos/reg/'
HEADERS  = {'user-agent': 'spot-the-plane'}


def call_api(plane_id, base_url=BASE_URL, headers=HEADERS):
    url = f'{base_url}{plane_id}'
    res = requests.get(url, headers=headers)
    if res.status_code not in [200, 201]:
        res.raise_for_status()
    else:
        data = res.json()['photos'][0]
        pic = data['thumbnail_large']['src']
        link = data['link']
        photog = data['photographer']
        return {
            "pic": pic,
            "link": link,
            "copyright": f'\u00a9 {photog}'
        }


def create_game(seed):
    # todo: check for registration viability; if no pics, mark not-viable and load new registration
    data = []
    images = []
    chaos_seed = seed / 100000000
    plane_types = Counter(get_planes(seed))
    for ptype in plane_types:
        random.seed(seed)
        p = random.sample(Aircraft.query.filter_by(model=ptype).all(), k=plane_types[ptype])
        for plane in p:
            question = [[plane.id, plane.model, call_api(plane.id)]]
            images.append(question[0][2]['pic'])
            answers = get_answers(chaos_seed, plane.model)
            for a in answers:
                question.append(a)
            data.append(shuffle_planes(chaos_seed, question))
            chaos_seed = get_chaos(chaos_seed)
        time.sleep(0.34)    # how low can this be to avoid 429 error?
    return shuffle_planes(seed, data), images
    