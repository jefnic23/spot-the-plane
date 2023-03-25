from config import settings
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Database:
    def __init__(self):
        self.engine = create_async_engine(settings.DB_URL, echo=True, future=True)
        self.session = async_sessionmaker(self.engine, expire_on_commit=False, class_=AsyncSession)

    async def get_session(self) -> async_sessionmaker[AsyncSession]:
        async with self.engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)


db = Database()