from flask import Blueprint, request

from api.game import Game, get_quote

bp = Blueprint('game', __name__)


@bp.route('/api/game', methods=['POST']) 
def game():
    seed = request.get_json()['seed']
    game = Game(seed)
    return game.create_game()


@bp.route('/api/quote', methods=['GET'])
def quote():
    return get_quote()
