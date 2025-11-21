from app.models.db import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String)
    password = Column(String)
    
    decks = relationship("Deck", back_populates="user")
    