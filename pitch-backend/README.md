# Pitch Deck Grader (Node.js + TypeScript)

Express microservice for AI-powered pitch deck analysis. Accepts file uploads (PDF/DOCX/TXT), extracts text, grades via OpenAI with structured JSON output, and automatically persists results to the FastAPI backend database.

## Technical Overview

### Stack
- **Runtime**: Node.js with TypeScript (CommonJS for `ts-node` compatibility)
- **Framework**: Express 4.19
- **File Upload**: Multer with temporary storage
- **Document Parsing**: pdf-parse, mammoth (DOCX), placeholder for PPTX
- **AI Provider**: OpenAI API v4 with structured output (JSON schema enforcement)
- **Persistence**: Automatic POST to FastAPI backend via axios

### Architecture

```
src/
├── server.ts           # Express app initialization, CORS, route mounting, error handling
├── routes/
│   └── grade.ts        # POST /api/grade endpoint with file upload & DB persistence
├── extract.ts          # Document text extraction (PDF, DOCX, TXT support)
├── llm.ts              # OpenAI integration with retry logic & fallback scoring
├── store.ts            # In-memory run storage (last 1000 results, non-persistent)
├── types.ts            # TypeScript interfaces & JSON schema definition
└── types-external.d.ts # Type declarations for external packages
```

### Core Features

1. **Multi-format Document Extraction**:
   - PDF: pdf-parse library
   - DOCX: mammoth raw text extraction
   - TXT: Direct file read with UTF-8 encoding
   - PPTX: Placeholder (returns error message)
   - Legacy DOC: Unsupported (user instructed to convert)

2. **AI-Powered Grading**:
   - Structured JSON output via OpenAI's `response_format` with schema validation
   - Deterministic scoring (seed=42, temperature=0)
   - Adaptive retry: removes unsupported parameters if model rejects them
   - Fallback scoring: returns conservative 0-score Hold verdict on failure

3. **Automated Persistence**:
   - After grading, automatically POSTs results to FastAPI backend
   - Non-blocking: failure doesn't prevent user from receiving results
   - Stores verdict, scores, suggestions, and red flags in PostgreSQL

4. **In-Memory Run History**:
   - Last 1000 grading runs stored in memory
   - Queryable via `/api/runs` and `/api/runs/:id`
   - Cleared on server restart

### Grading Schema

**Output Structure** (`GradingResult`):
```typescript
{
  run_id: string;           // UUID for this grading run
  filename: string;         // Original uploaded filename
  overall_score: number;    // 0-100 composite score
  scores: {
    problem_solution_fit: number;      // 0-100
    market_potential: number;          // 0-100
    business_model_strategy: number;   // 0-100
    team_strength: number;             // 0-100
    financials_and_traction: number;   // 0-100
    communication: number;             // 0-100
  };
  summaries: {
    problem: string;   // Key problem identified
    solution: string;  // Proposed solution
    market: string;    // Market analysis
    team: string;      // Team assessment
    traction: string;  // Traction/metrics summary
  };
  suggestions: string[];         // Improvement recommendations
  red_flags: string[];          // Warning indicators
  verdict: "Invest" | "Hold" | "Pass";  // Final recommendation
  timestamp: string;            // ISO 8601 timestamp
}
```

## Prerequisites

- **Node.js**: 18+ (20.11+ recommended)
- **npm**: 9+ or equivalent package manager
- **OpenAI API Key**: Required for grading functionality
- **FastAPI Backend**: Running at `http://localhost:8000` (configurable)

## Setup & Installation

### 1. Install Dependencies
```bash
cd pitch-backend
npm install
```

### 2. Configure Environment
Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

**Required Variables:**
```env
OPENAI_API_KEY=sk-your-api-key-here
```

**Optional Variables:**
```env
OPENAI_MODEL=gpt-4o-mini              # Default model override
PORT=8080                              # Server port (default: 8080)
PYTHON_BACKEND_URL=http://localhost:8000  # FastAPI backend URL
MAX_FILE_SIZE_MB=25                   # File size limit
```

### 3. Run Development Server
```bash
npm run dev
```
Server starts at `http://127.0.0.1:8080` with hot reload via `ts-node`.

### 4. Build for Production
```bash
npm run build    # Compiles TypeScript to dist/
npm start        # Runs compiled JavaScript
```

## API Endpoints

Base URL: `http://127.0.0.1:8080`

### Grade Pitch Deck
**POST** `/api/grade`

Upload and grade a pitch deck file.

**Request:**
- Content-Type: `multipart/form-data`
- Field name: `file`
- Supported formats: PDF, DOCX, TXT
- Max size: 25MB

**cURL Example:**
```bash
curl -X POST http://localhost:8080/api/grade \
  -F "file=@pitch_deck.pdf"
```

**Response (200 OK):**
```json
{
  "run_id": "550e8400-e29b-41d4-a716-446655440000",
  "filename": "pitch_deck.pdf",
  "overall_score": 75,
  "scores": {
    "problem_solution_fit": 80,
    "market_potential": 70,
    "business_model_strategy": 75,
    "team_strength": 85,
    "financials_and_traction": 65,
    "communication": 78
  },
  "summaries": {
    "problem": "High customer acquisition costs in SaaS",
    "solution": "AI-powered lead qualification platform",
    "market": "$50B TAM in B2B sales automation",
    "team": "2x founders with 15 years combined experience",
    "traction": "$100K MRR, 200 customers, 25% MoM growth"
  },
  "suggestions": [
    "Strengthen financial projections with detailed unit economics",
    "Add competitive analysis comparing to Gong and Outreach"
  ],
  "red_flags": [
    "No clear exit strategy mentioned",
    "Burn rate may exceed runway without additional funding"
  ],
  "verdict": "Invest",
  "timestamp": "2025-12-03T10:30:00.000Z"
}
```

**Error Responses:**
- `400`: No file uploaded or upload failed
- `500`: Missing API key, extraction failure, or LLM error

### List Recent Grading Runs
**GET** `/api/runs`

Returns last 10 grading runs (in-memory only).

**Response:**
```json
[
  {
    "run_id": "550e8400-...",
    "filename": "pitch_deck.pdf",
    "verdict": "Invest",
    "overall_score": 75,
    "timestamp": "2025-12-03T10:30:00.000Z"
  }
]
```

### Get Specific Run
**GET** `/api/runs/:id`

Retrieve full grading result by `run_id`.

**Response:** Same as POST `/api/grade` response, or 404 if not found.

## Data Flow

1. **Frontend** → Uploads file to `/api/grade`
2. **grade.ts** → Multer saves to `uploads_tmp/`
3. **extract.ts** → Parses document and extracts text
4. **llm.ts** → Sends text to OpenAI with JSON schema
5. **OpenAI API** → Returns structured grading JSON
6. **grade.ts** → POSTs result to FastAPI `/api/deck` endpoint
7. **FastAPI** → Stores in PostgreSQL database
8. **grade.ts** → Returns result to frontend
9. **store.ts** → Caches result in memory for `/api/runs` queries

## Error Handling & Resilience

### Document Extraction Failures
- Unreadable files → Replaced with `[[UNREADABLE_DECK]]` marker
- LLM generates conservative Hold verdict with red flag
- Max file size enforcement (25MB default)

### OpenAI API Failures
**Adaptive Retry Logic** (llm.ts):
1. **Attempt 1**: Structured output with JSON schema + temperature=0
2. **Attempt 2**: Removes unsupported parameters if model rejects them
3. **Fallback**: Returns 0-score Hold verdict with error message in red_flags

### Database Save Failures
- Non-blocking: Logs error but still returns grading result to user
- Ensures frontend always receives analysis even if persistence fails

## CORS Configuration

**Development Mode** (default):
```typescript
cors({
  origin: '*',  // Allow all origins
  methods: ['GET','POST','OPTIONS'],
  allowedHeaders: ['Content-Type','Accept']
})
```

**Production**: Update `server.ts` to restrict origins:
```typescript
origin: process.env.ALLOWED_ORIGINS?.split(',') || 'https://yourdomain.com'
```

## Development

### Request Logging
Every request logs: method, path, and processing time.

### Adding New Document Formats
Edit `extract.ts`:
```typescript
if (ext === '.pptx') {
  // Install: npm install pptx-parser
  const pptxParser = require('pptx-parser');
  const slides = await pptxParser.parse(filePath);
  return clean(slides.map(s => s.text).join(' '));
}
```

### Adding AI Providers (Gemini, Claude)
Extend `llm.ts` with provider abstraction:
```typescript
interface LlmOptions {
  provider: 'openai' | 'gemini' | 'anthropic';
  apiKey: string;
}
```

### Model Customization
Override via environment variable:
```env
OPENAI_MODEL=gpt-4o          # Premium model
OPENAI_MODEL=gpt-4-turbo     # Faster variant
OPENAI_MODEL=gpt-3.5-turbo   # Cost-effective option
```

## Testing

### Manual Testing
```bash
# Start server
npm run dev

# Test grade endpoint
curl -X POST http://localhost:8080/api/grade \
  -F "file=@test_deck.pdf"

# Check run history
curl http://localhost:8080/api/runs
```

### Unit Tests (To Be Implemented)
```bash
npm install --save-dev jest @types/jest ts-jest
npm test
```

## Production Considerations

### Security
- [ ] Implement file type validation (magic number checking)
- [ ] Add virus scanning for uploads
- [ ] Rate limiting per IP/user (express-rate-limit)
- [ ] Authentication/authorization middleware
- [ ] Input sanitization for filenames
- [ ] HTTPS/TLS enforcement

### Performance
- [ ] Stream large file uploads instead of memory storage
- [ ] Implement caching for duplicate file hashes
- [ ] Queue system for concurrent grading (Bull/BullMQ)
- [ ] Connection pooling for FastAPI requests

### Reliability
- [ ] Replace in-memory store with Redis/PostgreSQL
- [ ] Dead letter queue for failed DB saves
- [ ] Structured logging (Winston/Pino)
- [ ] Health check endpoint (`/health`)
- [ ] Graceful shutdown handling

### Monitoring
- [ ] OpenTelemetry instrumentation
- [ ] Error tracking (Sentry)
- [ ] Request/response logging
- [ ] Cost tracking for OpenAI API usage

## Integration with CapsightAI Ecosystem

**Component Relationships:**
- **Frontend** (React, port 3000): User interface for file upload
- **pitch-backend** (this service, port 8080): AI grading engine
- **Backend** (FastAPI, port 8000): Database persistence & user management

**Typical Workflow:**
1. User uploads deck via React frontend
2. Frontend sends file to this service (`/api/grade`)
3. Service grades deck and auto-saves to FastAPI backend
4. Frontend retrieves user's deck history from FastAPI
5. Results displayed in dashboard with score cards and suggestions

## Troubleshooting

### "Missing OPENAI_API_KEY" Error
- Verify `.env` file exists in `pitch-backend/` directory
- Confirm `OPENAI_API_KEY` is set with valid `sk-` key
- Restart server after editing `.env`

### "PPTX_EXTRACTION_NOT_IMPLEMENTED" Error
- PPTX support is placeholder only
- Convert slides to PDF or implement pptx-parser integration

### Database Connection Failures
- Check `PYTHON_BACKEND_URL` environment variable
- Verify FastAPI backend is running at specified URL
- Review logs for axios error details

### File Upload Failures
- Confirm file size < 25MB
- Check `uploads_tmp/` directory exists and is writable
- Verify file extension is supported (.pdf, .docx, .txt)

## License

Internal MVP - specify license before external use.
