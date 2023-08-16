from typing import AsyncGenerator

import aiohttp

from api.database import db
from api.repo import Repo


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
