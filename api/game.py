from flask import Blueprint, request
from api.planes import create_game

bp = Blueprint('game', __name__)


@bp.route('/api/game', methods=['POST']) 
def game():
    seed = request.get_json()['seed']
    data = create_game(seed)
    return {'data': data, 'day': seed}
