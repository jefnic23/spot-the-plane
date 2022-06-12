import time
import random
import requests
from collections import Counter
from api.models import Aircraft

# weights applied to each model
models = {
    'A320': 0.754,
    '737': 0.732,
    '777': 0.684,
    'A330': 0.678,
    'CRJ': 0.671,
    'ERJ': 0.639,
    '767': 0.597,
    '787': 0.589,
    '757': 0.552,
    '747': 0.409,
    'MD-80': 0.408,
    'A380': 0.394,
    'A340': 0.383,
    'A350': 0.363,
    'MD-11': 0.333
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
HEADERS = {'user-agent': 'spot-the-plane'}
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
    data = []
    chaos_seed = seed / 100000000
    plane_types = Counter(get_planes(seed))
    for ptype in plane_types:
        random.seed(seed)
        p = random.sample(Aircraft.query.filter_by(model=ptype).all(), k=plane_types[ptype])
        for plane in p:
            question = [[plane.id, plane.model, call_api(plane.id)]]
            answers = get_answers(chaos_seed, plane.model)
            for a in answers:
                question.append(a)
            data.append(shuffle_planes(chaos_seed, question))
            chaos_seed = get_chaos(chaos_seed)
        time.sleep(0.34)    # how low can this need to be to not get 429 error?
    return shuffle_planes(seed, data)
    