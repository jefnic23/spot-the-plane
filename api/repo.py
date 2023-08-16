import random

from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from api.models import Aircraft, Quote


class Repo():
    def __init__(self, session: AsyncSession):
        self.db: AsyncSession = session


    async def get_plane(
        self,
        seed: int,
        plane_type: str = '',
        used_aircraft: list[str] = []
    ) -> Aircraft:
        '''
        Gets a list of aircraft from the database.
        '''
        await self.db.execute(select(func.setseed(seed)))
        query = (
            select(Aircraft)
            .filter_by(viable=True, typecode=plane_type)
            .where(~Aircraft.registration.in_(used_aircraft))
            .order_by(func.random())
        )
        res = await self.db.execute(query)
        return res.scalars().first()
            

    async def get_quote(self, seed: int) -> dict[str, str]:
        '''Gets a quote from the database.'''
        num_rows = await self.db.execute(select(func.count(Quote.index)))
        random.seed(seed)
        id = random.randint(0, num_rows.scalar_one())
        query = await self.db.execute(select(Quote).where(Quote.index == id))
        res = query.scalars().one()
        return {'quote': res.quote, 'author': res.author}
    
    
    @staticmethod
    async def update_plane(plane: Aircraft) -> None:
        '''Updates a plane's viable status in the database.'''
        plane.viable = False
