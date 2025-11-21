from app.models.db import Base
from sqlalchemy import Integer, Column, String, ForeignKey
from sqlalchemy.orm import relationship

class Deck(Base):
    __tablename__ = "decks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    deck_text = Column(String)
    suggestions = Column(String)
    red_flags = Column(String)

    user = relationship("User", back_populates="decks")
