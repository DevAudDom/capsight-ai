# Pitch Deck Grader (Node + TypeScript)

Separate microservice that accepts pitch deck uploads, extracts text, and grades them via OpenAI (LLM) returning structured JSON.

## Features
- Express + TypeScript (CommonJS for easier `ts-node` usage)
- File upload via Multer (`file` field)
- PDF, DOCX, TXT extraction (PPTX placeholder, unsupported types error)
- LLM grading with JSON schema enforcement (retry & fallback logic)
- Adaptive retry: drops unsupported parameters (e.g. `temperature`) if model rejects them
- Model override via `OPENAI_MODEL` env var
- In-memory run store (non-persistent) for listing recent grades
- CORS enabled for local React + FastAPI integration

## Quick Start
```
cd pitch-backend
npm install
npm run dev
```
Starts on `http://127.0.0.1:8080` (override with `PORT`).

### .env Example
```
OPENAI_API_KEY=sk-xxx
OPENAI_MODEL=gpt-4o-mini   # optional override; defaults internally if omitted
PORT=8080
```

## Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/grade | Upload a single file (field name `file`) and receive grading JSON |
| GET | /api/runs | List all stored run metadata (in-memory) |
| GET | /api/runs/:id | Retrieve a single run by id |

## Grading Output Shape
See `src/types.ts` for schema. Includes scores (overall, clarity, market, team, financials, differentiator), feedback array, risks array, summary.

## How It Works
1. Upload handled by Multer (memory storage).
2. `extract.ts` detects file type & parses text.
3. `llm.ts` sends chat completion with JSON schema response_format.
4. If schema call fails, it retries removing unsupported params; then attempts a relaxed prompt; finally builds a minimal JSON fallback if still unsuccessful.
5. Result stored in-memory (`store.ts`) and returned.

## CORS & Logging
`server.ts` enables permissive CORS for development and logs each request method, path, and duration. Restrict origins before production.

## Development Notes
- Uses OpenAI SDK `openai`.
- Ensure `OPENAI_API_KEY` is set; requests fail fast when missing.
- No persistence—restart loses previous runs.
- PPTX extraction placeholder; implement using a library (e.g. `pptxparser`) or convert slides to text.

## Extensibility
- Add provider abstraction (Gemini/Anthropic) by creating a new client in `llm.ts` with unified adapter interface.
- Persist results: swap in database layer in `store.ts` (e.g. Postgres or call FastAPI to save).
- Enrich schema with more dimensions (e.g. ESG, AI strategy) while keeping response size reasonable.

## Next Steps
- Robust PPTX parsing.
- Persistence & linkage to core FastAPI backend.
- Auth & rate limiting.
- Frontend visualization improvements (score bars, risk badges).
- Enhanced error taxonomy for better UI feedback.

## License
Internal MVP; specify license before external use.
