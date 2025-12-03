from pydantic import BaseModel
from typing import Dict, List, Optional

class DeckScores(BaseModel):
    """Scores object matching AI response from TypeScript backend"""
    overall_score: int  # 0-100
    problem_solution_fit: int
    market_potential: int
    business_model_strategy: int
    team_strength: int
    financials_and_traction: int
    communication: int

class DeckCreate(BaseModel):
    """Schema for creating a new deck with AI analysis results"""
    user_id: int
    filename: str
    timestamp: str
    verdict: str
    scores: DeckScores
    suggestions: List[str]  # Changed from strengths
    red_flags: List[str]

class Deck(BaseModel):
    """Schema for returning deck data"""
    id: int
    user_id: int
    filename: str
    timestamp: str
    verdict: str
    scores: Dict  # Returns as dict for flexibility
    suggestions: List[str]
    red_flags: List[str]
    
    class Config:
        from_attributes = True   # replaces orm_mode=True in Pydantic v2

class DeckAnalytics(Deck):
    """Extended schema with analytics - same as Deck for now"""
    pass