from sqlalchemy.orm import Session
from app.models.deck import Deck as DeckModel
from app.schemas.deck import DeckCreate, Deck, DeckAnalytics
# create_user is a function that takes "session" our db connection manager, and "createUser" 
# our pydantic model which serves as a validation tool
def create_deck(db: Session, data: DeckCreate):
    """Create a new deck with AI analysis results.
    
    The scores field is converted from Pydantic model to dict for JSON storage.
    strengths, weaknesses, and red_flags are stored as JSON arrays.
    """
    # Convert Pydantic model to dict, ensuring scores is a dict for JSON column
    deck_data = data.model_dump()
    deck_instance = DeckModel(**deck_data)
    db.add(deck_instance)
    db.commit()
    db.refresh(deck_instance)
    return deck_instance

def get_deck(db: Session, deck_id: int):
    """Retrieve a deck by ID. JSON fields are automatically deserialized."""
    return db.query(DeckModel).filter(DeckModel.id == deck_id).first()

def get_decks_by_user(db: Session, user_id: int):
    """Retrieve all decks for a specific user."""
    return db.query(DeckModel).filter(DeckModel.user_id == user_id).all()