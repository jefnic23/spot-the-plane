from flask import Blueprint, request

from api.data import create_game, get_quote

bp = Blueprint('game', __name__)


@bp.route('/api/game', methods=['POST']) 
def game():
    seed = request.get_json()['seed']
    data, images = create_game(seed)
    return {'data': data, 'images': images, 'day': seed}


@bp.route('/api/quote', methods=['GET'])
def quote():
    return get_quote()
