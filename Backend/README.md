# Backend (FastAPI)

FastAPI service exposing core application data (users, decks) and utility endpoints.

## Prerequisites

- Python 3.10+
- PostgreSQL running (or adjust connection string for your setup) – default DSN is defined in `app/models/db.py`.
- (Optional) OpenAI / LLM keys if you later integrate grading results storage here.

## Quickstart

### One-line (recommended)
On Windows (cmd):
```
run_backend.bat
```
This creates a virtualenv (./venv), installs requirements, and starts uvicorn on `http://127.0.0.1:8000` with reload.

### Manual Steps
```
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000 --host 127.0.0.1
```

## Environment Variables

Create a `.env` (optional) if you need to override config.

| Variable | Purpose | Example |
|----------|---------|---------|
| DATABASE_URL | Override Postgres connection | postgresql://user:pass@localhost:5432/capsight |

If `DATABASE_URL` is absent the hard-coded default in `db.py` is used.

## Project Structure

```
app/
├── main.py          # FastAPI app factory & router inclusion, startup logging
├── models/          # SQLAlchemy ORM models & DB session
├── routes/          # API route modules (users, decks, uploads, hello)
├── schemas/         # Pydantic v2 schemas (from_attributes enabled)
└── services/        # Business logic (user/deck services)
```

## Key Endpoints

Base path: `http://127.0.0.1:8000`

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/hello | Simple health/message endpoint (added for frontend check) |
| GET | /api/users | List users |
| POST | /api/users | Create user |
| GET | /api/decks | List decks |
| POST | /api/decks | Create deck |

> Additional upload or grading-result persistence endpoints can be added under `/api/` as the Pitch Deck Grader evolves.

## CORS

`main.py` configures permissive CORS for local development so the React frontend (port 3000) and the grading microservice can call this API. Tighten origins before production deployment.

## Development Tips

- After adding dependencies: `pip install <pkg> && pip freeze > requirements.txt`.
- Use the interactive docs: navigate to `http://127.0.0.1:8000/docs`.
- Startup log lists registered routes for quick verification.

## Integration with Pitch Deck Grader (Node service)

The separate grading microservice runs typically on port 8080. Once a grading result is returned to the frontend you can POST it here (e.g. create a `GradingResult` model & route) for persistence and later analytics. This backend currently does not store grading results – planned enhancement.

## Testing (placeholder)

Add tests under a new `tests/` directory using `pytest`:
```
pip install pytest
pytest
```

## Next Steps

- Add persistent storage for grading results.
- Parameterize database credentials via `.env`.
- Implement auth & rate limiting.
