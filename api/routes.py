from fastapi import APIRouter

from game import Game
from services import get_quote

router = APIRouter()


@router.get('/api/game') 
async def game(seed: int):
    game = Game(seed)
    return await game.create_game()


@router.get('/api/quote')
async def quote(seed: int):
    return await get_quote(seed)
