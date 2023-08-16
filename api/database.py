from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import declarative_base

from api.config import settings


Base = declarative_base()

class Database:
    def __init__(self):
        self.engine = create_async_engine(
            settings.DATABASE_URL.replace('postgres', 'postgresql+asyncpg'),
            echo=False,
            future=True
        )
        self.session = async_sessionmaker(
            self.engine, 
            expire_on_commit=False, 
            class_=AsyncSession
        )

db = Database()
