from pydantic import BaseModel
from typing import Dict, List, Optional

class DeckScores(BaseModel):
    """Scores object matching AI response"""
    overall: int
    problem: int
    solution: int
    market: int
    product: int
    business_model: int
    competition: int
    team: int
    financials: int
    presentation: int

class DeckCreate(BaseModel):
    """Schema for creating a new deck with AI analysis results"""
    user_id: int
    filename: str
    timestamp: str
    verdict: str
    scores: DeckScores
    strengths: List[str]
    weaknesses: List[str]
    red_flags: List[str]

class Deck(BaseModel):
    """Schema for returning deck data"""
    id: int
    user_id: int
    filename: str
    timestamp: str
    verdict: str
    scores: Dict  # Returns as dict for flexibility
    strengths: List[str]
    weaknesses: List[str]
    red_flags: List[str]
    
    class Config:
        from_attributes = True   # replaces orm_mode=True in Pydantic v2

class DeckAnalytics(Deck):
    """Extended schema with analytics - same as Deck for now"""
    pass