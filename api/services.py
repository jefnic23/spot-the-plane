import random
from typing import AsyncGenerator

import aiohttp
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from api.database import db
from api.models import Aircraft, Quote
from api.repo import Repo


async def get_plane(
    db: AsyncSession,
    seed: int,
    plane_type: str = '',
    used_aircraft: list[str] = []
) -> Aircraft:
    '''Gets a list of aircraft from the database.'''
    query = (
        select(Aircraft)
        .filter_by(viable=True, typecode=plane_type)
        .where(~Aircraft.registration.in_(used_aircraft))
    )
    res = await db.execute(query)
    random.seed(seed)
    return random.choice(res.scalars().all())
    

async def update_plane(db: AsyncSession, plane: Aircraft) -> None:
    '''Updates a plane's viable status in the database.'''
    plane.viable = False
    await db.commit()
    

async def get_quote(db: AsyncSession, seed: int) -> dict[str, str]:
    '''Gets a quote from the database.'''
    num_rows = await db.execute(select(func.count(Quote.index)))
    random.seed(seed)
    id = random.randint(0, num_rows.scalar_one())
    query = await db.execute(select(Quote).where(Quote.index == id))
    res = query.scalars().first()
    return {'quote': res.quote, 'author': res.author}
    

async def request_async(
        url: str, 
        headers: dict[str, str]
    ) -> dict[str, str]:
    '''Makes an asynchronous HTTP request.'''
    async with aiohttp.ClientSession() as client:
        async with client.get(url, headers=headers) as res:
            if res.status not in [200, 201]:
                await res.raise_for_status()
            else:
                return await res.json()


async def get_db() -> AsyncGenerator[Repo, None]:
    '''Gets a database session.'''
    async with db.session() as session:
        async with session.begin():
            yield Repo(session)
