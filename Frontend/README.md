# Frontend (React)

React single-page application for CapsightAI pitch deck grading platform. Provides UI for file upload, AI-powered grading visualization, and deck history management.

## Technical Overview

### Stack
- **Framework**: React 18.3.1
- **Build Tool**: Create React App (CRA) 5.0.1
- **Routing**: React Router DOM v6.26.1
- **Styling**: Custom CSS with dark purple analytics theme
- **State Management**: React Hooks (useState, useEffect)
- **Storage**: localStorage for client-side deck history

### Architecture

```
src/
├── index.js                    # App entry point, React root initialization
├── App.js                      # Route configuration, layout structure
├── components/                 # Reusable UI components
│   ├── Header.js               # Site header with branding
│   ├── Footer.js               # Site footer
│   ├── DataCard.js             # Card container component
│   └── dashboard/              # Dashboard-specific components
│       ├── ScoreCard.js        # Category score display with progress bar
│       ├── SuggestionsList.js  # Improvement suggestions list
│       └── RedFlagsList.js     # Warning indicators list
├── pages/                      # Route-level page components
│   ├── Home.js                 # Landing page with backend health check
│   ├── About.js                # About page (static content)
│   ├── Contact.js              # Contact form (demo, no backend)
│   ├── Grade.js                # Simple file upload with JSON response
│   └── dashboard/              # Main application features
│       ├── UploadDeckPage.js   # File upload with drag-and-drop
│       ├── ResultsPage.js      # Grading results visualization
│       └── DeckHistoryPage.js  # Historical deck grading list
├── services/                   # API and utility functions
│   ├── api.js                  # Fetch wrappers for backend APIs
│   └── history.js              # localStorage history management
└── styles/
    └── global.css              # Global styles + dashboard theme
```

### Core Features

1. **Drag-and-Drop File Upload**:
   - Supports PDF, PPTX file formats
   - 10MB file size limit with client-side validation
   - Visual drag-over state feedback
   - File type and size validation

2. **AI Grading Dashboard**:
   - Overall verdict display (Invest/Hold/Pass)
   - 6-category score breakdown with progress bars
   - AI-generated suggestions for improvement
   - Red flags and warning indicators
   - Responsive card-based layout

3. **Deck History**:
   - LocalStorage persistence (last 50 entries)
   - Chronological list with scores and verdicts
   - Quick stats preview for each deck
   - Clear all history functionality
   - Direct navigation to past results

4. **Results Visualization**:
   - Color-coded score indicators (green/yellow/red)
   - Progress bars for visual score representation
   - Export report button (placeholder)
   - Detailed breakdown by category

## Prerequisites

- **Node.js**: 18+ (20.11+ recommended)
- **npm**: 9+ or yarn equivalent
- **Running Services**:
  - pitch-backend (Node.js grading service) at port 8080
  - Backend (FastAPI) at port 8000 (optional, for history API)

## Setup & Installation

### 1. Install Dependencies
```bash
cd Frontend
npm install
```

### 2. Configure Environment (Optional)
Create `.env` file for API base URLs:
```env
REACT_APP_API_BASE=http://127.0.0.1:8000
REACT_APP_GRADER_BASE=http://127.0.0.1:8080
```

**Note**: If not set, defaults are:
- `REACT_APP_API_BASE`: `http://127.0.0.1:8000`
- `REACT_APP_GRADER_BASE`: `http://localhost:8080`

### 3. Start Development Server
```bash
npm start
```
Opens at `http://localhost:3000` with hot reload.

### 4. Build for Production
```bash
npm run build
```
Creates optimized production build in `build/` directory.

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Start** | `npm start` | Development server with hot reload (port 3000) |
| **Build** | `npm run build` | Production build to `build/` folder |
| **Test** | `npm test` | Run test suite (React Testing Library) |
| **Eject** | `npm run eject` | Eject from CRA (irreversible, not recommended) |

## Application Routes

Base URL: `http://localhost:3000`

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Home | Landing page with backend health check |
| `/about` | About | Project information |
| `/contact` | Contact | Contact form demo |
| `/grade` | Grade | Simple file upload with JSON display |
| `/dashboard/upload` | UploadDeckPage | **Main upload interface** with drag-and-drop |
| `/dashboard/results?id={timestamp}` | ResultsPage | Detailed grading results |
| `/dashboard/history` | DeckHistoryPage | List of all graded decks |

## API Integration

### Service Layer (`src/services/api.js`)

All backend communication is centralized in `api.js`:

**1. Health Check (FastAPI)**
```javascript
getHello()
// GET http://127.0.0.1:8000/api/hello
// Returns: { message: "Hello from FastAPI" }
```

**2. Simple Grade Upload**
```javascript
uploadGrade(file)
// POST http://localhost:8080/api/grade
// Body: multipart/form-data with 'file' field
// Returns: Full GradingResult JSON
```

**3. Pitch Deck Upload (Dashboard)**
```javascript
uploadPitchDeck(file)
// POST http://localhost:8080/api/grade
// Body: multipart/form-data with 'file' field
// Timeout: 30 seconds
// Returns: GradingResult with scores, suggestions, red_flags
```

**Request Flow:**
1. User uploads file via UploadDeckPage
2. `uploadPitchDeck()` sends to pitch-backend
3. pitch-backend extracts text and grades via OpenAI
4. pitch-backend auto-saves to FastAPI database
5. Result returned to frontend and saved to localStorage
6. User redirected to ResultsPage

### History Management (`src/services/history.js`)

LocalStorage-based persistence for grading history:

```javascript
saveToHistory(result)      // Save new grading result
getHistory()               // Get all history (max 50 entries)
getHistoryItem(timestamp)  // Get specific result by timestamp
clearHistory()             // Delete all history
```

**Storage Key**: `deck_grading_history`  
**Max Entries**: 50 (oldest entries removed automatically)

## Component Architecture

### Page Components

**UploadDeckPage** (`/dashboard/upload`):
- Drag-and-drop file input
- File validation (type, size)
- Upload progress state
- Navigation to results on success
- Error handling with user feedback

**ResultsPage** (`/dashboard/results`):
- Query parameter routing (`?id={timestamp}`)
- Verdict badge (Invest/Hold/Pass)
- Overall score display
- 6 ScoreCard components for category breakdown
- SuggestionsList component
- RedFlagsList component
- Export report button (future implementation)

**DeckHistoryPage** (`/dashboard/history`):
- Chronological list of all graded decks
- Quick stats preview (all 6 category scores)
- Color-coded scores (green ≥80, yellow ≥60, red <60)
- Red flags count indicator
- Clear history dialog with confirmation
- Empty state with CTA to upload first deck

### Reusable Components

**ScoreCard**:
- Props: `title`, `score` (0-100)
- Color-coded display (high/medium/low)
- Horizontal progress bar
- Used in ResultsPage for all 6 categories

**SuggestionsList**:
- Props: `suggestions` (string array)
- Check icon + text layout
- Used in ResultsPage

**RedFlagsList**:
- Props: `redFlags` (string array)
- Alert icon + text layout
- Used in ResultsPage

**DataCard**:
- Props: `title`, `children`
- Generic card wrapper
- Used in Home, About, Contact, Grade pages

## Styling System

### Theme Variables (`global.css`)

**Light Mode (General Pages):**
```css
--primary: #0f62fe
--text: #111827
--muted: #6b7280
--bg: #f8fafc
```

**Dark Purple Analytics Theme (Dashboard):**
```css
--dashboard-bg: #0a0a1a
--dashboard-card: #1a1a2e
--dashboard-primary: #8b5cf6
--dashboard-success: #10b981  (score ≥80)
--dashboard-warning: #f59e0b  (score ≥60)
--dashboard-danger: #ef4444   (score <60)
```

### Responsive Design

Dashboard pages use flexbox and grid layouts optimized for:
- Desktop: Full-width score grids, side-by-side layouts
- Tablet: Stacked cards, adjusted grid columns
- Mobile: Single-column layouts, touch-friendly buttons

## Data Flow

### Upload & Grading Flow
```
1. User drops file in UploadDeckPage
   ↓
2. validateFile() checks type and size
   ↓
3. handleUpload() calls uploadPitchDeck(file)
   ↓
4. POST to http://localhost:8080/api/grade
   ↓
5. pitch-backend extracts text + grades via OpenAI
   ↓
6. pitch-backend POSTs result to FastAPI /api/deck
   ↓
7. pitch-backend returns GradingResult to frontend
   ↓
8. saveToHistory() stores in localStorage
   ↓
9. navigate(`/dashboard/results?id=${timestamp}`)
   ↓
10. ResultsPage retrieves from localStorage
   ↓
11. Render score cards, suggestions, red flags
```

### History Persistence
```
localStorage['deck_grading_history'] = [
  {
    run_id: "uuid",
    filename: "pitch_deck.pdf",
    timestamp: "2025-12-03T10:30:00Z",
    verdict: "Invest",
    overall_score: 75,
    scores: { ... },
    summaries: { ... },
    suggestions: [...],
    red_flags: [...]
  },
  // ... up to 50 entries
]
```

## Development

### Hot Reload
CRA provides instant feedback on code changes - no manual refresh needed.

### Adding New Pages
1. Create component in `src/pages/`
2. Add route in `App.js`:
   ```javascript
   <Route path="/new-page" element={<NewPage />} />
   ```
3. Add navigation link:
   ```javascript
   <Link to="/new-page">New Page</Link>
   ```

### Adding New API Endpoints
Edit `src/services/api.js`:
```javascript
export async function newEndpoint(params) {
  const url = `${API_BASE}/api/new-endpoint`;
  const response = await withTimeout(
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    })
  );
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
```

### Custom Styling
1. Edit `src/styles/global.css` for global changes
2. Add component-specific styles to global.css (current approach)
3. Or create component.module.css for scoped styles (alternative)

### Browser DevTools
- Network tab: Inspect API calls, check CORS issues
- React DevTools: Component hierarchy, props, state inspection
- Console: View `[api]` debug logs from service layer

## Testing

### Current Status
No tests implemented yet (placeholder).

### Setup React Testing Library
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### Example Test (`src/__tests__/UploadDeckPage.test.js`)
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UploadDeckPage from '../pages/dashboard/UploadDeckPage';

test('renders upload button', () => {
  render(
    <BrowserRouter>
      <UploadDeckPage />
    </BrowserRouter>
  );
  expect(screen.getByText(/Upload & Grade/i)).toBeInTheDocument();
});
```

Run tests:
```bash
npm test
```

## Production Deployment

### Build Optimization
```bash
npm run build
```
Creates minified, optimized bundle in `build/`:
- Code splitting
- Asset optimization
- Source maps (optional)
- Service worker (if enabled)

### Hosting Options

**Static Hosting (Recommended):**
- **Vercel**: `vercel --prod` (auto-detects CRA)
- **Netlify**: Drag `build/` folder or connect Git repo
- **AWS S3 + CloudFront**: Upload `build/` to S3, configure CDN
- **GitHub Pages**: `npm install gh-pages` + scripts

**Environment Variables for Production:**
Create `.env.production`:
```env
REACT_APP_API_BASE=https://api.capsightai.com
REACT_APP_GRADER_BASE=https://grader.capsightai.com
```

**Build with Production Env:**
```bash
npm run build
# Automatically uses .env.production
```

### CORS Considerations
Ensure backend services allow frontend domain:
```javascript
// pitch-backend/src/server.ts
app.use(cors({
  origin: 'https://app.capsightai.com',
  methods: ['GET','POST','OPTIONS']
}));
```

## Troubleshooting

### "Failed to fetch" Errors
**Cause**: Backend services not running or CORS blocked  
**Fix**:
1. Verify pitch-backend running at port 8080
2. Check FastAPI backend at port 8000
3. Inspect browser console for CORS errors
4. Verify `.env` URLs match running services

### File Upload Fails
**Cause**: Invalid file type or size limit exceeded  
**Fix**:
1. Confirm file is PDF or PPTX
2. Check file size < 10MB
3. Review browser console for validation errors
4. Verify pitch-backend `MAX_FILE_SIZE_MB` setting

### History Not Persisting
**Cause**: localStorage disabled or full  
**Fix**:
1. Check browser privacy settings (incognito blocks localStorage)
2. Clear old localStorage data
3. Check browser console for quota errors

### Blank Page After Build
**Cause**: Incorrect homepage in package.json  
**Fix**:
```json
// package.json
"homepage": ".",  // For relative paths
// OR
"homepage": "https://yourdomain.com"  // For absolute
```

### Hot Reload Not Working
**Cause**: Port conflict or cache issue  
**Fix**:
```bash
# Kill process on port 3000
npx kill-port 3000

# Clear cache and restart
rm -rf node_modules/.cache
npm start
```

## Performance Considerations

### Code Splitting
Implement lazy loading for dashboard routes:
```javascript
import { lazy, Suspense } from 'react';

const UploadDeckPage = lazy(() => import('./pages/dashboard/UploadDeckPage'));

<Suspense fallback={<div>Loading...</div>}>
  <Route path="/dashboard/upload" element={<UploadDeckPage />} />
</Suspense>
```

### Asset Optimization
- Use WebP images for better compression
- Lazy load images below the fold
- Minify CSS/JS in production build (automatic with CRA)

### API Caching
Add request caching for repeated API calls:
```javascript
const cache = new Map();

export async function getCachedData(key, fetcher, ttl = 60000) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }
  const data = await fetcher();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
}
```

## Future Enhancements

### Short-term
- [ ] Add loading skeleton components
- [ ] Implement error boundaries
- [ ] Add form validation library (Formik/React Hook Form)
- [ ] Export report as PDF functionality
- [ ] Add toast notifications for user feedback

### Medium-term
- [ ] User authentication (JWT/OAuth)
- [ ] Real-time grading progress updates (WebSockets)
- [ ] Deck comparison view
- [ ] Share results via unique links
- [ ] Advanced filtering/sorting in history

### Long-term
- [ ] Migrate to Next.js for SSR
- [ ] Add analytics dashboard
- [ ] Collaborative deck review features
- [ ] Integration with Slack/Discord
- [ ] Mobile app (React Native)

## Integration with CapsightAI Ecosystem

**Component Architecture:**
```
┌─────────────────┐
│  Frontend       │ (React, port 3000)
│  - Upload UI    │
│  - Results View │
│  - History      │
└────────┬────────┘
         │
         ├─────────────> pitch-backend (Node.js, port 8080)
         │               - File upload
         │               - AI grading
         │               - Auto-save to DB
         │
         └─────────────> Backend (FastAPI, port 8000)
                         - Retrieve history
                         - User management
```

**Data Consistency:**
- Frontend localStorage for instant access
- FastAPI PostgreSQL for persistent server-side storage
- Future: Sync localStorage with server on auth

## License

Internal MVP - specify license before external distribution.
