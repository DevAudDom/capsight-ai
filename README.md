# Capsight AI Monorepo

Multi-service MVP comprising:
1. React Frontend (`Frontend/`) – user interface & file upload.
2. FastAPI Backend (`Backend/`) – core domain (users, decks) & future persistence for grading results.
3. Pitch Deck Grader (`pitch-backend/`) – Node/TypeScript microservice performing LLM-based grading of uploaded decks.

## Architecture Overview

```
Browser (React) --(REST / fetch)--> FastAPI (port 8000)
		 |\
		 | \--(multipart upload)--> Pitch Grader (port 8080) --(OpenAI API)--> LLM
		 |
		 +--(future)--> Store grading result in FastAPI/Postgres
```

Ports (defaults):
- Frontend: 3000
- FastAPI: 8000
- Pitch Grader: 8080

## Quick Start (Windows cmd)

Open three terminals:

Frontend:
```
cd Frontend
npm install
npm start
```

Backend:
```
.\run_backend.bat
```

Pitch Deck Grader:
```
cd pitch-backend
copy .env.example .env
REM Edit .env to add OPENAI_API_KEY
npm install
npm run dev
```

Visit: `http://localhost:3000` (React). Grade page uploads to `http://127.0.0.1:8080/api/grade`.

## Environment Variables

Frontend (`Frontend/.env`):
```
REACT_APP_API_BASE=http://127.0.0.1:8000
REACT_APP_GRADER_BASE=http://127.0.0.1:8080
```

FastAPI (`Backend/.env` optional):
```
DATABASE_URL=postgresql://user:pass@localhost:5432/capsight
```

Pitch Grader (`pitch-backend/.env`):
```
OPENAI_API_KEY=sk-xxx
OPENAI_MODEL=gpt-4o-mini
PORT=8080
```

## Key Endpoints

FastAPI:
- GET /api/hello
- GET /api/users, POST /api/users
- GET /api/decks, POST /api/decks

Pitch Grader:
- POST /api/grade (multipart file=@deck.pdf)
- GET /api/runs
- GET /api/runs/:id

## Data Flow (Grading)
1. User selects file on Grade page.
2. Frontend sends multipart request to Pitch Grader.
3. Service extracts text (pdf/docx/txt) and calls OpenAI with schema.
4. Adaptive retry if strict parameters rejected; fallback JSON if persistent failure.
5. Response displayed in UI (not yet persisted).
6. (Planned) Frontend POSTs result to FastAPI for storage.

## Development Notes
- CORS enabled on both backends for local development. Restrict before production.
- Pitch Grader is stateless aside from in-memory run list; restart clears history.
- PPTX extraction currently placeholder.
- Requirements pinned in `Backend/requirements.txt`; keep them updated when adding libs.

## Future Enhancements
- Persist grading results (link runs to users & decks).
- Real PPTX parser.
- Additional LLM providers (Gemini, Anthropic) via abstraction.
- AuthN/AuthZ across services.
- Score visualization & analytics dashboard.
- Background job queue for larger decks.

## Repository Structure
```
Backend/        # FastAPI service
Frontend/       # React app
pitch-backend/  # Node grading microservice
README.md       # (this file)
```

See individual READMEs in each folder for deeper setup and notes.

## Requirements
- Python 3.10+
- Node.js 18+
- PostgreSQL (for future persistent storage)

## License
Internal project (MVP). Define license before external distribution.
