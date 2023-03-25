from sqlalchemy import Boolean, Column, Float, Integer, String
from database import Base


class Aircraft(Base):
    __tablename__ = "aircraft"
    registration = Column(String(255), primary_key=True)
    manufacturericao = Column(String(255), nullable=False)
    model = Column(String(255), nullable=False)
    typecode = Column(String(255), nullable=False)
    viable = Column(Boolean, nullable=False, default=True)


class PlaneType(Base):
    __tablename__ = "planetypes"
    model = Column(String(255), primary_key=True)
    num_planes = Column(Integer, nullable=False)
    weight = Column(Float, nullable=True)


class Quote(Base):
    __tablename__ = "quotes"
    index = Column(Integer, primary_key=True)
    quote = Column(String(255), nullable=False)
    author = Column(String(255), nullable=False)
    