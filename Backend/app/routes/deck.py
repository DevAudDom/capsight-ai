from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.deck import DeckCreate, Deck, DeckAnalytics
from app.services import deck_services
from app.models.db import get_db

# deck_database = [
# {'deck_id': 1 , 'user_id': 1, "deck_text": "good pitch",
#   "summaries_json": 
#  {
#     "Problem": "no money",
#     "Solution": "do software engineering",
#     "Market": "tech",
#     "Team": "great team",
#     "Traction": "bad pitch"}
#  ,
#   'scores_json':
#     {'problem_solution_fit': 1, 'market_potential': 2, 
#      'business_model_strategy': 3, 'team_strength': 4, 
#      'financials_and_traction': 5, 'communication': 6
#      },
#   "suggestions_json": "would invest", 
#   "red_flags_json": "CEO and CTO are the same person"
# }  

# ]

router = APIRouter(tags=["deck"])

@router.get("/deck/{deck_id}", response_model=Deck)
def get_deck(deck_id: int, db: Session = Depends(get_db)):
    """Get deck by ID."""
    deck = deck_services.get_deck(db=db, deck_id=deck_id)
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found")
    return deck

@router.post('/deck', response_model=Deck)
def create_deck(deck_data: DeckCreate, db: Session = Depends(get_db)):
  """Create a new deck with AI analysis results.
  
  Expects:
  - user_id, filename, timestamp
  - verdict (string: 'Invest' or 'Pass')
  - scores (object with 10 numeric scores)
  - strengths, weaknesses, red_flags (arrays of strings)
  """
  deck = deck_services.create_deck(db=db, data=deck_data)
  if not deck:
    raise HTTPException(status_code=400, detail="Failed to create deck")
  return deck

@router.get('/deck/user/{user_id}', response_model=List[Deck])
def get_user_decks(user_id: int, db: Session = Depends(get_db)):
  """Get all decks for a specific user."""
  decks = deck_services.get_decks_by_user(db=db, user_id=user_id)
  return decks