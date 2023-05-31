from fastapi import APIRouter, Depends
from api.database import Database
from api.game import Game
from api.repo import Repo
from api.services import get_db

router = APIRouter()


@router.get('/api/game') 
async def game(seed: int, repo: Repo = Depends(get_db)):
    game = Game(seed, repo)
    return await game.create_game()


@router.get('/api/quote')
async def quote(seed: int, repo: Repo = Depends(get_db)):
    return await repo.get_quote(seed)
