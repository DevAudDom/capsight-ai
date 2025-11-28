from app.models.db import Base
from sqlalchemy import Integer, Column, String, ForeignKey, JSON
from sqlalchemy.orm import relationship

class Deck(Base):
    __tablename__ = "decks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    filename = Column(String)
    timestamp = Column(String)
    verdict = Column(String)
    scores = Column(JSON)  # Stores: {"overall": 70, "problem": 75, "solution": 70, ...}
    strengths = Column(JSON)  # Stores array of strings
    weaknesses = Column(JSON)  # Stores array of strings
    red_flags = Column(JSON)  # Stores array of strings

    user = relationship("User", back_populates="decks")
