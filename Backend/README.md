# Backend (FastAPI)

FastAPI service providing REST API for user management and pitch deck analysis storage. Integrates with a separate Node.js TypeScript grading service for AI-powered pitch deck evaluation.

## Technical Overview

### Stack
- **Framework**: FastAPI 0.115.0 with Uvicorn ASGI server
- **Database**: PostgreSQL via SQLAlchemy 2.0.44 ORM
- **Validation**: Pydantic v2 schemas with `from_attributes` support
- **Document Processing**: pdfminer.six, PyPDF2, python-pptx, python-docx, mammoth
- **AI Integration**: OpenAI, Google Generative AI clients (for future use)

### Architecture

```
app/
├── main.py              # FastAPI app initialization, CORS config, route registration
├── models/              # SQLAlchemy ORM models
│   ├── db.py            # Database engine, session factory, Base declarative
│   ├── user.py          # User model with email/password
│   └── deck.py          # Deck model with JSON fields (scores, suggestions, red_flags)
├── routes/              # API endpoint definitions
│   ├── user.py          # User CRUD operations
│   └── deck.py          # Deck creation and retrieval by user/ID
├── schemas/             # Pydantic validation schemas
│   ├── user.py          # UserCreate, User response models
│   └── deck.py          # DeckCreate, Deck, DeckScores models
└── services/            # Business logic layer
    ├── user_services.py # User creation and retrieval
    └── deck_services.py # Deck persistence and queries
```

### Core Features

1. **User Management**: Basic user creation and retrieval with email/password storage
2. **Deck Storage**: Persists AI analysis results including:
   - Verdict (Invest/Hold/Pass)
   - Scores (overall + 6 categories: problem_solution_fit, market_potential, business_model_strategy, team_strength, financials_and_traction, communication)
   - Suggestions array (AI-generated improvement recommendations)
   - Red flags array (warning indicators)
3. **CORS Middleware**: Configured for cross-origin requests (all origins allowed in dev)
4. **JSON Column Storage**: PostgreSQL JSON fields for flexible score/suggestion data structures

### Database Schema

**Users Table:**
- `id` (PK), `email`, `password`

**Decks Table:**
- `id` (PK), `user_id` (FK → users), `filename`, `timestamp`, `verdict`
- `scores` (JSON): `{"overall_score": int, "problem_solution_fit": int, ...}`
- `suggestions` (JSON): `["suggestion1", "suggestion2", ...]`
- `red_flags` (JSON): `["flag1", "flag2", ...]`

## Prerequisites

- **Python**: 3.10+
- **PostgreSQL**: Running instance at `localhost:5432`
- **Database**: Create database named `capsight` with user `postgres:postgres` (or customize in `app/models/db.py`)

## Setup & Installation

### Option 1: Automated (Windows)
Run from repository root:
```cmd
run_backend.bat
```
This script:
1. Creates `.venv` virtual environment if not present
2. Installs dependencies from `requirements.txt`
3. Starts Uvicorn server at `http://127.0.0.1:8000` with hot reload

### Option 2: Manual Setup
```bash
# Navigate to Backend directory
cd Backend

# Create virtual environment
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate

# Activate (Unix/MacOS)
source .venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

## Environment Configuration

**Database Connection:**  
Default: `postgresql://postgres:postgres@localhost:5432/capsight`  
To customize, edit `SQLALCHEMY_DATABASE_URL` in `app/models/db.py`.

**Optional `.env` file:**  
Currently not implemented, but you can add `python-dotenv` loading for:
- `DATABASE_URL`
- `SECRET_KEY` (for future auth)

## API Endpoints

Base URL: `http://127.0.0.1:8000`

### Health Check
- `GET /` - Returns `{"status": "ok", "service": "capsightai-backend"}`

### Users
- `POST /api/user` - Create new user
  - Body: `{"email": "string", "password": "string"}`
  - Returns: `User` object with `id`
- `GET /api/user/{user_id}` - Get user by ID

### Decks
- `POST /api/deck` - Store pitch deck analysis results
  - Body: `DeckCreate` schema (see below)
  - Returns: Created `Deck` with generated `id`
- `GET /api/deck/{deck_id}` - Retrieve deck by ID
- `GET /api/deck/user/{user_id}` - Get all decks for a user

**Example DeckCreate Payload:**
```json
{
  "user_id": 1,
  "filename": "startup_pitch.pdf",
  "timestamp": "2025-12-03T10:30:00Z",
  "verdict": "Invest",
  "scores": {
    "overall_score": 75,
    "problem_solution_fit": 80,
    "market_potential": 70,
    "business_model_strategy": 75,
    "team_strength": 85,
    "financials_and_traction": 65,
    "communication": 78
  },
  "suggestions": [
    "Strengthen financial projections",
    "Add competitive analysis"
  ],
  "red_flags": [
    "No clear exit strategy"
  ]
}
```

## Development

### Interactive API Docs
- **Swagger UI**: `http://127.0.0.1:8000/docs`
- **ReDoc**: `http://127.0.0.1:8000/redoc`

### Startup Logs
On launch, registered routes are printed to console for verification.

### Adding Dependencies
```bash
pip install <package-name>
pip freeze > requirements.txt
```

### Database Migrations
Currently using SQLAlchemy's `Base.metadata.create_all()` pattern. For production:
1. Install Alembic: `pip install alembic`
2. Initialize: `alembic init migrations`
3. Configure `alembic.ini` with database URL
4. Generate migrations: `alembic revision --autogenerate -m "description"`
5. Apply: `alembic upgrade head`

## Integration with Grading Service

The separate **pitch-backend** (Node.js/TypeScript service at port 8080) handles:
- PDF/PPTX file upload
- Text extraction (pdf-parse, pptx-parse)
- AI grading via OpenAI/Gemini
- Returns analysis to frontend

This FastAPI backend receives the grading results from the frontend and persists them for:
- User history tracking
- Analytics dashboard
- Historical comparison

**Data Flow:**
1. Frontend uploads file to Node.js grading service (port 8080)
2. Grading service returns AI analysis
3. Frontend POSTs results to FastAPI `/api/deck` endpoint
4. FastAPI stores in PostgreSQL
5. Frontend retrieves user's deck history via `/api/deck/user/{user_id}`

## Production Considerations

- [ ] Restrict CORS origins to specific domains
- [ ] Implement authentication (JWT, OAuth)
- [ ] Hash passwords (bcrypt, Argon2)
- [ ] Use environment variables for secrets
- [ ] Add request rate limiting
- [ ] Configure logging (structured JSON logs)
- [ ] Set up database connection pooling
- [ ] Add input sanitization
- [ ] Implement proper error handling middleware
- [ ] Use HTTPS/TLS certificates
