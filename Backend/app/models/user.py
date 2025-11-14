from db import Base
from sqlalchemy import Column, Integer, String

class User(Base):
    id = Column(Integer, primarykey=True)
    name = Column(String)