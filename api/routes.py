from fastapi import APIRouter

from api.game import Game, get_quote

router = APIRouter()


@router.get('/api/game') 
async def game(seed: int):
    game = Game(seed)
    return game.create_game()


@router.get('/api/quote')
async def quote(seed: int):
    return get_quote(seed)
