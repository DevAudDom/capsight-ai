# CapsightAI - Pitch Deck Grading Platform

AI-powered pitch deck analysis platform with automated grading, scoring, and feedback generation. Built with React frontend, FastAPI backend for persistence, and Node.js/TypeScript microservice for AI grading.

## System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         User Browser                              │
│                    React App (port 3000)                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  • Drag-and-drop file upload                               │  │
│  │  • Real-time grading results visualization                 │  │
│  │  • 6-category score breakdown with progress bars           │  │
│  │  • Suggestions & red flags display                         │  │
│  │  • localStorage history (last 50 decks)                    │  │
│  └────────────────────────────────────────────────────────────┘  │
└───────┬──────────────────────────────────────────┬───────────────┘
        │                                          │
        │ File Upload (multipart/form-data)       │ History API
        │                                          │
        ▼                                          ▼
┌────────────────────────┐              ┌──────────────────────────┐
│   pitch-backend        │              │   Backend (FastAPI)      │
│   Node.js + TypeScript │◄─────────────│   Python + PostgreSQL    │
│   Port 8080            │  Auto-save   │   Port 8000              │
├────────────────────────┤              ├──────────────────────────┤
│ • File extraction      │              │ • User management        │
│   - PDF (pdf-parse)    │              │ • Deck storage (JSON)    │
│   - DOCX (mammoth)     │              │ • History retrieval      │
│   - TXT (fs.read)      │              │ • SQLAlchemy ORM         │
│ • OpenAI API grading   │              │ • Pydantic validation    │
│ • JSON schema output   │              └──────────────────────────┘
│ • Adaptive retry logic │
│ • In-memory run cache  │
└────────┬───────────────┘
         │
         │ Structured JSON Request
         │
         ▼
┌─────────────────────────┐
│   OpenAI API            │
│   gpt-4o-mini (default) │
├─────────────────────────┤
│ • Text analysis         │
│ • Structured output     │
│ • 6-category scoring    │
│ • Suggestions generation│
│ • Red flags detection   │
└─────────────────────────┘
```

**Service Ports (default):**
- Frontend: 3000
- Backend (FastAPI): 8000
- pitch-backend (Grading): 8080

## Quick Start

### Prerequisites
- **Node.js**: 18+ (20.11+ recommended)
- **Python**: 3.10+
- **PostgreSQL**: Running instance at `localhost:5432`
- **OpenAI API Key**: Required for AI grading

### 1. Database Setup
```sql
-- Create PostgreSQL database
createdb capsight

-- Or using psql
CREATE DATABASE capsight;
```

### 2. Backend (FastAPI) - Terminal 1
```bash
# Windows
.\run_backend.bat

# Or manually
cd Backend
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Unix/MacOS
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
**Running at**: `http://127.0.0.1:8000`  
**API Docs**: `http://127.0.0.1:8000/docs`

### 3. Grading Service (Node.js) - Terminal 2
```bash
cd pitch-backend

# Configure environment
cp .env.example .env
# Edit .env and add: OPENAI_API_KEY=sk-your-key-here

npm install
npm run dev
```
**Running at**: `http://127.0.0.1:8080`

### 4. Frontend (React) - Terminal 3
```bash
cd Frontend
npm install
npm start
```
**Running at**: `http://localhost:3000`

### 5. Test the Application
1. Navigate to `http://localhost:3000/dashboard/upload`
2. Drag and drop a PDF or PPTX file
3. Click "Upload & Grade"
4. View results with scores, suggestions, and red flags
5. Check history at `/dashboard/history`

## Environment Configuration

### Frontend (`Frontend/.env`) - Optional
```env
REACT_APP_API_BASE=http://127.0.0.1:8000
REACT_APP_GRADER_BASE=http://127.0.0.1:8080
```
**Note**: Defaults are set if not provided.

### Backend (`Backend/.env`) - Optional
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/capsight
SECRET_KEY=your-secret-key-here  # For future auth
```
**Note**: Default connection string is hardcoded in `app/models/db.py`.

### pitch-backend (`pitch-backend/.env`) - **REQUIRED**
```env
# Required
OPENAI_API_KEY=sk-your-openai-api-key-here

# Optional
OPENAI_MODEL=gpt-4o-mini              # Default model
PORT=8080                              # Server port
PYTHON_BACKEND_URL=http://localhost:8000  # FastAPI URL
MAX_FILE_SIZE_MB=25                   # File size limit
LOG_LEVEL=info                        # Logging verbosity
```

## API Endpoints

### Backend (FastAPI) - `http://127.0.0.1:8000`

**Health Check:**
- `GET /` → `{"status": "ok", "service": "capsightai-backend"}`

**Users:**
- `POST /api/user` - Create new user
  - Body: `{"email": "string", "password": "string"}`
- `GET /api/user/{user_id}` - Get user by ID

**Decks (Grading History):**
- `POST /api/deck` - Store grading result (auto-called by pitch-backend)
  - Body: `DeckCreate` schema with scores, suggestions, red_flags
- `GET /api/deck/{deck_id}` - Retrieve deck by ID
- `GET /api/deck/user/{user_id}` - Get all decks for a user

**Interactive Docs:**
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

### pitch-backend (Grading) - `http://127.0.0.1:8080`

**Grading:**
- `POST /api/grade` - Upload and grade pitch deck
  - Content-Type: `multipart/form-data`
  - Field: `file` (PDF, DOCX, TXT)
  - Returns: Full `GradingResult` with scores, suggestions, red_flags

**Run History (In-Memory):**
- `GET /api/runs` - List last 10 grading runs
- `GET /api/runs/:id` - Get specific run by run_id

### Frontend (React) - `http://localhost:3000`

**Pages:**
- `/` - Home page with backend health check
- `/dashboard/upload` - **Main upload interface** (drag-and-drop)
- `/dashboard/results?id={timestamp}` - Grading results visualization
- `/dashboard/history` - List of all graded decks (localStorage)
- `/grade` - Simple upload with JSON response
- `/about` - About page
- `/contact` - Contact form demo

## Complete Data Flow

### Upload & Grading Workflow

```
1. User Action
   └─> Drag/drop file in UploadDeckPage (/dashboard/upload)
       └─> File validation (type: PDF/PPTX, size: <10MB)

2. Frontend → pitch-backend
   └─> POST http://localhost:8080/api/grade
       └─> multipart/form-data with 'file' field

3. pitch-backend Processing
   ├─> extract.ts: Parse document
   │   ├─> PDF: pdf-parse library
   │   ├─> DOCX: mammoth text extraction
   │   └─> TXT: fs.readFileSync with UTF-8
   │
   ├─> llm.ts: OpenAI API call
   │   ├─> Structured JSON output (JSON schema enforcement)
   │   ├─> Deterministic scoring (seed=42, temperature=0)
   │   ├─> Adaptive retry if model rejects parameters
   │   └─> Fallback: 0-score Hold verdict on failure
   │
   └─> grade.ts: Dual persistence
       ├─> store.ts: In-memory cache (last 1000 runs)
       └─> axios POST to http://localhost:8000/api/deck
           └─> FastAPI stores in PostgreSQL

4. Response Flow
   ├─> pitch-backend returns GradingResult to Frontend
   ├─> Frontend saves to localStorage (last 50 entries)
   └─> Navigate to /dashboard/results?id={timestamp}

5. Results Display
   ├─> Verdict badge (Invest/Hold/Pass)
   ├─> Overall score (0-100)
   ├─> 6 ScoreCard components with progress bars
   │   ├─> Problem-Solution Fit
   │   ├─> Market Potential
   │   ├─> Business Model Strategy
   │   ├─> Team Strength
   │   ├─> Financials & Traction
   │   └─> Communication
   ├─> SuggestionsList (improvement recommendations)
   └─> RedFlagsList (warning indicators)
```

### Data Persistence Strategy

**Dual Storage Approach:**
1. **localStorage (Frontend)**: Instant access, client-side only, 50 entry limit
2. **PostgreSQL (Backend)**: Server-side persistence, unlimited history, user-linked

**Current Implementation:**
- pitch-backend automatically saves to PostgreSQL after grading
- Frontend saves to localStorage for immediate access
- Future: Sync localStorage with server on user authentication

## Tech Stack Details

### Frontend
- **React**: 18.3.1 with Create React App
- **Router**: React Router DOM v6.26.1
- **Styling**: Custom CSS with dark purple analytics theme
- **State**: React Hooks (useState, useEffect)
- **Storage**: localStorage for client-side history

### Backend (FastAPI)
- **Framework**: FastAPI 0.115.0
- **Server**: Uvicorn ASGI server
- **Database**: PostgreSQL via SQLAlchemy 2.0.44 ORM
- **Validation**: Pydantic v2 with `from_attributes`
- **Document Processing**: pdfminer.six, PyPDF2, python-pptx, python-docx, mammoth
- **AI Clients**: OpenAI, Google Generative AI (installed, not yet used)

### pitch-backend (Grading)
- **Runtime**: Node.js with TypeScript (CommonJS)
- **Framework**: Express 4.19
- **File Upload**: Multer with temporary storage
- **Document Parsing**: pdf-parse, mammoth
- **AI Provider**: OpenAI API v4
- **HTTP Client**: axios (for FastAPI communication)

## Key Features

### AI Grading Engine
- **Scoring Categories** (0-100 each):
  1. Problem-Solution Fit
  2. Market Potential
  3. Business Model Strategy
  4. Team Strength
  5. Financials & Traction
  6. Communication
- **Overall Score**: Composite 0-100 rating
- **Verdict**: Invest / Hold / Pass recommendation
- **Suggestions**: AI-generated improvement recommendations
- **Red Flags**: Warning indicators and concerns

### Document Support
- ✅ **PDF**: Full text extraction via pdf-parse
- ✅ **DOCX**: Raw text extraction via mammoth
- ✅ **TXT**: Direct UTF-8 file reading
- ⚠️ **PPTX**: Placeholder (not yet implemented)
- ❌ **DOC**: Legacy format not supported

### Error Resilience
- **Adaptive Retry Logic**: Removes unsupported OpenAI parameters if rejected
- **Fallback Scoring**: Conservative 0-score Hold verdict on persistent failures
- **Non-blocking DB Saves**: Grading results returned even if PostgreSQL save fails
- **File Validation**: Client and server-side type/size checks

## Development Tips

### CORS Configuration
- Both backends configured with permissive CORS for local development
- **Production**: Restrict origins in `server.ts` and `main.py`

### Hot Reload
- **Frontend**: CRA automatic hot reload
- **Backend**: Uvicorn `--reload` flag
- **pitch-backend**: `ts-node` with nodemon (via `npm run dev`)

### Adding Dependencies

**Frontend:**
```bash
cd Frontend
npm install <package>
# Committed automatically in package.json
```

**Backend:**
```bash
cd Backend
.venv\Scripts\activate
pip install <package>
pip freeze > requirements.txt
```

**pitch-backend:**
```bash
cd pitch-backend
npm install <package>
# Committed automatically in package.json
```

### Database Schema Updates
Currently using `Base.metadata.create_all()` for schema creation. For production:
1. Install Alembic: `pip install alembic`
2. Initialize: `alembic init migrations`
3. Generate migration: `alembic revision --autogenerate -m "description"`
4. Apply: `alembic upgrade head`

### Logging & Debugging
- **Frontend**: Browser DevTools console (`[api]` prefixed logs)
- **Backend**: Uvicorn console output with route registration
- **pitch-backend**: Express request logging (method, path, duration)

## Testing

### Current Status
- No automated tests implemented yet
- Manual testing via UI and API endpoints

### Planned Testing Strategy

**Frontend:**
```bash
cd Frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm test
```

**Backend:**
```bash
cd Backend
pip install pytest pytest-cov
pytest
```

**pitch-backend:**
```bash
cd pitch-backend
npm install --save-dev jest @types/jest ts-jest
npm test
```

## Production Deployment

### Security Checklist
- [ ] Restrict CORS origins to production domains
- [ ] Implement authentication (JWT/OAuth)
- [ ] Hash passwords with bcrypt/Argon2
- [ ] Use environment variables for all secrets
- [ ] Add rate limiting (FastAPI + Express)
- [ ] Enable HTTPS/TLS certificates
- [ ] Input sanitization and validation
- [ ] File upload virus scanning
- [ ] Content Security Policy headers

### Performance Optimization
- [ ] Frontend code splitting and lazy loading
- [ ] PostgreSQL connection pooling
- [ ] Redis caching for API responses
- [ ] CDN for static assets
- [ ] Image optimization (WebP format)
- [ ] Gzip/Brotli compression
- [ ] Database indexing on frequently queried fields

### Monitoring & Observability
- [ ] Structured logging (Winston/Pino)
- [ ] Error tracking (Sentry)
- [ ] Application metrics (Prometheus)
- [ ] Request tracing (OpenTelemetry)
- [ ] Uptime monitoring
- [ ] Cost tracking for OpenAI API usage

## Troubleshooting

### Common Issues

**"Failed to fetch" / CORS Errors**
- Verify all three services are running
- Check browser console for CORS error details
- Confirm environment variables are set correctly

**OpenAI API Errors**
- Verify `OPENAI_API_KEY` is set in `pitch-backend/.env`
- Check API key is valid and has credits
- Review rate limits on OpenAI account

**Database Connection Failures**
- Ensure PostgreSQL is running: `pg_ctl status`
- Verify database exists: `psql -l | grep capsight`
- Check connection string in `app/models/db.py`

**File Upload Failures**
- Confirm file size < 10MB (Frontend) / 25MB (pitch-backend)
- Verify file type is PDF, DOCX, or TXT
- Check `uploads_tmp/` directory exists and is writable

**Port Already in Use**
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :8000
netstat -ano | findstr :8080
taskkill /PID <pid> /F

# Unix/MacOS
lsof -ti:3000 | xargs kill -9
lsof -ti:8000 | xargs kill -9
lsof -ti:8080 | xargs kill -9
```

## Future Enhancements

### Short-term (MVP+)
- [ ] ✅ Persist grading results to PostgreSQL (DONE)
- [ ] Implement PPTX text extraction
- [ ] Add loading skeleton components
- [ ] Export grading report as PDF
- [ ] Toast notifications for user feedback
- [ ] Form validation library integration

### Medium-term
- [ ] User authentication & authorization
- [ ] Multi-provider LLM support (Gemini, Claude)
- [ ] Real-time grading progress (WebSockets)
- [ ] Deck comparison feature
- [ ] Advanced analytics dashboard
- [ ] Share results via unique links
- [ ] Email notifications for grading completion

### Long-term
- [ ] Team collaboration features
- [ ] Version history for deck revisions
- [ ] Custom scoring criteria configuration
- [ ] Integration with Slack/Discord
- [ ] Mobile app (React Native)
- [ ] Background job queue (Bull/BullMQ)
- [ ] Multi-language support (i18n)

## Repository Structure

```
capsight-ai/
├── Backend/                          # FastAPI service
│   ├── app/
│   │   ├── main.py                   # App initialization & routing
│   │   ├── models/                   # SQLAlchemy ORM models
│   │   │   ├── db.py                 # Database connection
│   │   │   ├── user.py               # User model
│   │   │   └── deck.py               # Deck model with JSON fields
│   │   ├── routes/                   # API endpoints
│   │   │   ├── user.py               # User CRUD
│   │   │   └── deck.py               # Deck CRUD
│   │   ├── schemas/                  # Pydantic validation
│   │   │   ├── user.py               # User schemas
│   │   │   └── deck.py               # Deck schemas
│   │   └── services/                 # Business logic
│   │       ├── user_services.py      # User operations
│   │       └── deck_services.py      # Deck operations
│   ├── requirements.txt              # Python dependencies
│   └── README.md                     # Backend documentation
│
├── Frontend/                         # React application
│   ├── src/
│   │   ├── App.js                    # Route configuration
│   │   ├── index.js                  # Entry point
│   │   ├── components/               # Reusable components
│   │   │   ├── Header.js             # Site header
│   │   │   ├── Footer.js             # Site footer
│   │   │   ├── DataCard.js           # Card wrapper
│   │   │   └── dashboard/            # Dashboard components
│   │   │       ├── ScoreCard.js      # Score display with progress bar
│   │   │       ├── SuggestionsList.js # Suggestions list
│   │   │       └── RedFlagsList.js   # Red flags list
│   │   ├── pages/                    # Route pages
│   │   │   ├── Home.js               # Landing page
│   │   │   ├── Grade.js              # Simple upload
│   │   │   └── dashboard/            # Main features
│   │   │       ├── UploadDeckPage.js # Drag-and-drop upload
│   │   │       ├── ResultsPage.js    # Results visualization
│   │   │       └── DeckHistoryPage.js # History list
│   │   ├── services/                 # API & utilities
│   │   │   ├── api.js                # Fetch wrappers
│   │   │   └── history.js            # localStorage management
│   │   └── styles/
│   │       └── global.css            # Global styles + theme
│   ├── package.json                  # Node dependencies
│   └── README.md                     # Frontend documentation
│
├── pitch-backend/                    # Node.js grading service
│   ├── src/
│   │   ├── server.ts                 # Express app
│   │   ├── routes/
│   │   │   └── grade.ts              # Grading endpoint
│   │   ├── extract.ts                # Document text extraction
│   │   ├── llm.ts                    # OpenAI integration
│   │   ├── store.ts                  # In-memory cache
│   │   └── types.ts                  # TypeScript interfaces
│   ├── uploads_tmp/                  # Temporary file storage
│   ├── .env.example                  # Environment template
│   ├── package.json                  # Node dependencies
│   ├── tsconfig.json                 # TypeScript config
│   └── README.md                     # Grading service docs
│
├── run_backend.bat                   # Windows launcher for FastAPI
└── README.md                         # This file (project overview)
```

**Documentation:**
- **This README**: High-level architecture and quick start
- **Backend/README.md**: FastAPI service details, API endpoints, database schema
- **Frontend/README.md**: React app architecture, components, data flow
- **pitch-backend/README.md**: Grading service implementation, AI integration

## System Requirements

### Software
- **Node.js**: 18+ (20.11+ recommended for best performance)
- **Python**: 3.10+ (3.11 recommended)
- **PostgreSQL**: 14+ (for production-ready features)
- **npm**: 9+ or yarn equivalent

### Hardware (Development)
- **CPU**: 2+ cores
- **RAM**: 8GB minimum (16GB recommended)
- **Disk**: 2GB free space for dependencies
- **Network**: Stable internet for OpenAI API calls

### API Keys
- **OpenAI API Key**: Required (get from https://platform.openai.com/api-keys)
- Recommended model: `gpt-4o-mini` (cost-effective)
- Alternative models: `gpt-4o`, `gpt-4-turbo`

## Contributing

### Code Style
- **Frontend**: Prettier + ESLint (to be configured)
- **Backend**: Black + Flake8 (to be configured)
- **pitch-backend**: Prettier + ESLint (to be configured)

### Git Workflow
1. Create feature branch from `main`
2. Make changes with descriptive commit messages
3. Test locally (all three services)
4. Submit pull request with detailed description

### Commit Message Format
```
type(scope): brief description

Detailed explanation if needed

Examples:
feat(frontend): add export PDF button to results page
fix(backend): correct deck query filter for user_id
docs(pitch-backend): update API endpoint examples
```

## Support & Resources

### Documentation
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)

### Internal Links
- API Documentation: `http://127.0.0.1:8000/docs` (when Backend running)
- Project Wiki: (to be created)
- Issue Tracker: GitHub Issues

## License

Internal MVP project. Define license before external distribution or open-sourcing.

---

**Last Updated**: December 3, 2025  
**Version**: 0.1.0 (MVP)  
**Status**: Active Development
