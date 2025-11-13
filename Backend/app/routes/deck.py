from fastapi import APIRouter

deck_database = [
{'deck_id': 1 , 'user_id': 1, "deck_text": "good pitch",
  "summaries_json": 
 {
    "Problem": "no money",
    "Solution": "do software engineering",
    "Market": "tech",
    "Team": "great team",
    "Traction": "bad pitch"}
 ,
  'scores_json':
    {'problem_solution_fit': 1, 'market_potential': 2, 
     'business_model_strategy': 3, 'team_strength': 4, 
     'financials_and_traction': 5, 'communication': 6
     },
  "suggestions_json": "would invest", 
  "red_flags_json": "CEO and CTO are the same person"
}  

]

router = APIRouter(tags=["deck"])

@router.get('/deck')
def get_deck():
    return deck_database

@router.get('/deck/{id}')
def get_deck_by_id(id :int):
    for deck in deck_database:
        if deck['deck_id'] == id:
            return deck