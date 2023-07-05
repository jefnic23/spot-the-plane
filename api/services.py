import random

import aiohttp
from sqlalchemy import func, select

from api.database import db
from api.models import Aircraft, Quote


async def get_plane(
    seed: int,
    plane_type: str = '',
    used_aircraft: list[str] = []
) -> Aircraft:
    '''Gets a list of aircraft from the database.'''
    async with db.session() as session:
        query = (
            select(Aircraft)
            .filter_by(viable=True, typecode=plane_type)
            .where(~Aircraft.registration.in_(used_aircraft))
        )
        res = await session.execute(query)
        random.seed(seed)
        return random.choice(res.scalars().all())
    

async def update_plane(plane: Aircraft) -> None:
    '''Updates a plane's viable status in the database.'''
    async with db.session() as session:
        plane.viable = False
        await session.commit()
    

async def get_quote(seed: int) -> dict[str, str]:
    '''Gets a quote from the database.'''
    async with db.session() as session:
        num_rows = await session.execute(select(func.count(Quote.index)))
        random.seed(seed)
        id = random.randint(0, num_rows.scalar_one())
        query = await session.execute(select(Quote).where(Quote.index == id))
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
