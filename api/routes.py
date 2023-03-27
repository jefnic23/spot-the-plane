from fastapi import APIRouter

from api.game import Game
from api.services import get_quote

router = APIRouter()


@router.get('/api/game') 
async def game(seed: int):
    game = Game(seed)
    return await game.create_game()


@router.get('/api/quote')
async def quote(seed: int):
    return await get_quote(seed)
