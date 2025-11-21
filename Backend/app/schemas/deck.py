from pydantic import BaseModel

class DeckModel(BaseModel):
    user_id: int
    deck_text: str

class DeckAnalytics(DeckModel):
    capsight_scores: str
    suggestions: str
    red_flags: str

class DeckCreate(DeckModel):
    pass

class Deck(DeckModel):
    id: int
    
    class Config:
        from_attributes = True   # replaces orm_mode=True in Pydantic v2