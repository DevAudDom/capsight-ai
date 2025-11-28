# Database Migration Guide

## Changes Made

### Updated Deck Model Structure
The `Deck` model has been updated to match the new AI response format:

**Removed fields:**
- `deck_text` (no longer needed)
- `capsight_scores` (renamed to `scores` with JSON type)
- `suggestions` (no longer provided by AI)

**Added/Updated fields:**
- `filename` (String) - Name of uploaded deck file
- `timestamp` (String) - When the deck was graded
- `verdict` (String) - AI verdict: "Invest" or "Pass"
- `scores` (JSON) - Object with 10 numeric scores
- `strengths` (JSON) - Array of strength strings
- `weaknesses` (JSON) - Array of weakness strings  
- `red_flags` (JSON) - Array of red flag strings

### JSON Column Storage

PostgreSQL JSON columns automatically serialize/deserialize:
- **`scores`**: `{"overall": 70, "problem": 75, "solution": 70, ...}`
- **`strengths`**: `["Large addressable market", "Clear validation", ...]`
- **`weaknesses`**: `["Light business model details", ...]`
- **`red_flags`**: `[]`

## Migration Steps

### Option 1: Drop and Recreate (Development Only - Loses Data)

```sql
-- Connect to your database
psql -U postgres -d capsight

-- Drop the existing table
DROP TABLE IF EXISTS decks CASCADE;

-- Exit psql
\q
```

Then run your Python app - it will recreate the table with new schema:
```bash
cd Backend
python -c "from app.models.db import create_table; create_table()"
```

### Option 2: Alter Table (Preserve Existing Data)

```sql
-- Connect to database
psql -U postgres -d capsight

-- Remove old columns
ALTER TABLE decks DROP COLUMN IF EXISTS deck_text;
ALTER TABLE decks DROP COLUMN IF EXISTS capsight_scores;
ALTER TABLE decks DROP COLUMN IF EXISTS suggestions;

-- Add new columns
ALTER TABLE decks ADD COLUMN filename VARCHAR;
ALTER TABLE decks ADD COLUMN timestamp VARCHAR;
ALTER TABLE decks ADD COLUMN verdict VARCHAR;
ALTER TABLE decks ALTER COLUMN red_flags TYPE JSON USING red_flags::json;

-- Rename and convert scores column
ALTER TABLE decks ADD COLUMN scores JSON;
ALTER TABLE decks ADD COLUMN strengths JSON;
ALTER TABLE decks ADD COLUMN weaknesses JSON;

-- Exit
\q
```

### Option 3: Use Alembic (Recommended for Production)

Install Alembic:
```bash
pip install alembic
alembic init alembic
```

Configure `alembic.ini` and create migration:
```bash
alembic revision --autogenerate -m "Update deck model for new AI format"
alembic upgrade head
```

## Testing the New Schema

After migration, test with a sample POST request:

```json
POST http://localhost:8000/deck
{
  "user_id": 1,
  "filename": "airbnb-original-deck-2008.pdf",
  "timestamp": "2025-11-24T22:06:51.693Z",
  "verdict": "Invest",
  "scores": {
    "overall": 70,
    "problem": 75,
    "solution": 70,
    "market": 80,
    "product": 70,
    "business_model": 65,
    "competition": 60,
    "team": 80,
    "financials": 50,
    "presentation": 60
  },
  "strengths": [
    "Large addressable market and clear market validation signals",
    "Simple, understandable solution with clear product-market fit",
    "Strong founding team with complementary skills"
  ],
  "weaknesses": [
    "Business model and monetization details are light and conservative",
    "Competitive dynamics (Craigslist and others) could pressure margins and adoption",
    "Financial projections and unit economics are not detailed in the deck"
  ],
  "red_flags": []
}
```

## Integration with pitch-backend

The pitch-backend service at `http://127.0.0.1:8080/api/grade` already returns this format. Your FastAPI backend just needs to:

1. Receive the upload from Frontend
2. Forward to pitch-backend for grading
3. Store the result using the new `DeckCreate` schema
4. Return the stored deck to Frontend

Example integration in your upload route:
```python
import requests

# After receiving file upload from frontend
response = requests.post(
    "http://127.0.0.1:8080/api/grade",
    files={"file": file_content}
)
ai_result = response.json()

# Create deck record
deck_create = DeckCreate(
    user_id=current_user_id,
    filename=ai_result["filename"],
    timestamp=ai_result["timestamp"],
    verdict=ai_result["verdict"],
    scores=ai_result["scores"],
    strengths=ai_result["strengths"],
    weaknesses=ai_result["weaknesses"],
    red_flags=ai_result["red_flags"]
)
deck = deck_services.create_deck(db, deck_create)
```
