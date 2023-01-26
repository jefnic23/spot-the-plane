from flask import Blueprint, request

from api.game import Game, get_quote

bp = Blueprint('game', __name__)


@bp.route('/api/game', methods=['GET']) 
def game():
    seed = int(request.args.get('seed'))
    game = Game(seed)
    return game.create_game()


@bp.route('/api/quote', methods=['GET'])
def quote():
    seed = int(request.args.get('seed'))
    return get_quote(seed)
