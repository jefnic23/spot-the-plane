from flask import Blueprint, request
from api.planes import create_game


bp = Blueprint('game', __name__)


@bp.route('/api/game', methods=['POST']) 
async def game():
    seed = await request.get_json()['seed']
    data, images = await create_game(seed)
    return {'data': data, 'images': images, 'day': seed}
