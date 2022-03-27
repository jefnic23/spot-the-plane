import random

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
