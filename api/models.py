from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from api.database import Base

class Aircraft(Base):
    __tablename__ = "aircraft"

    registration: Mapped[str] = mapped_column(primary_key=True)
    manufacturericao: Mapped[str] = mapped_column(nullable=False)
    model: Mapped[str] = mapped_column(nullable=False)
    typecode: Mapped[str] = mapped_column(
        ForeignKey('planetypes.model'), 
        nullable=False
    )
    viable: Mapped[bool] = mapped_column(nullable=False, default=True)


class PlaneType(Base):
    __tablename__ = "planetypes"

    model: Mapped[str] = mapped_column(primary_key=True)
    num_planes: Mapped[int] = mapped_column(nullable=False)
    weight: Mapped[float] = mapped_column(nullable=True)


class Quote(Base):
    __tablename__ = "quotes"

    index: Mapped[int] = mapped_column(primary_key=True)
    quote: Mapped[str] = mapped_column(nullable=False)
    author: Mapped[str] = mapped_column(nullable=False)
