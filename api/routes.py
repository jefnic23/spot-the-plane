from flask import Blueprint, request, jsonify

from api.data import create_game, get_quote

bp = Blueprint('game', __name__)


@bp.route('/api/game', methods=['POST']) 
def game():
    seed = request.get_json()['seed']
    return create_game(seed)


@bp.route('/api/quote', methods=['GET'])
def quote():
    return get_quote()
