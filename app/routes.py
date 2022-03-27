import random
from datetime import date
from collections import Counter
from flask import render_template
from app.planes import get_planes, get_answers, shuffle_planes
from app.models import Aircraft
from app import app

@app.route('/')
def index():
    data = []
    seed = int(date.today().strftime('%Y%m%d'))
    chaos_seed = seed / 100000000
    plane_types = Counter(get_planes(seed))
    for i, ptype in enumerate(plane_types,1):
        random.seed(seed)
        p = random.sample(Aircraft.query.filter_by(model=ptype).all(), k=plane_types[ptype])
        for plane in p:
            question = [[plane.id, plane.model]]
            answers = get_answers(round(chaos_seed * 100000000), plane.model)
            for a in answers:
                question.append(a)
            data.append(shuffle_planes(round(chaos_seed * 100000000), question))
            chaos_seed = 3.9 * chaos_seed * (1 - chaos_seed)

    return render_template('index.html', data=shuffle_planes(seed, data), day=seed)

if __name__ == '__main__':
    app.run()
