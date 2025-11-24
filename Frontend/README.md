# Frontend (React)

React client (Create React App) providing UI for Capsight AI and Pitch Deck Grader.

## Prerequisites
- Node.js 18+
- Yarn or npm (examples use npm)

## Install & Run
```
cd Frontend
npm install
npm start
```
App runs at `http://localhost:3000`.

## Environment Variables
Create `Frontend/.env` (CRA loads variables prefixed with `REACT_APP_`). Example:
```
REACT_APP_API_BASE=http://127.0.0.1:8000
REACT_APP_GRADER_BASE=http://127.0.0.1:8080
```
If not set, code may fallback to defaults (check `src/services/api.js`).

| Variable | Purpose |
|----------|---------|
| REACT_APP_API_BASE | FastAPI backend base URL |
| REACT_APP_GRADER_BASE | Pitch Deck Grader Node service base URL |

Restart `npm start` after changes.

## Structure
```
src/
├── App.js          # Routing & navigation
├── index.js        # Entry point
├── components/     # Reusable UI parts (Header, Footer, DataCard)
├── pages/          # Top‑level pages (Home, About, Contact, Grade)
├── services/api.js # Fetch helpers (hello, grade upload)
└── styles/global.css
```

## Grade Page (Pitch Deck Upload)
- Navigate to /grade via nav link.
- Select a pitch deck file (pdf, docx, txt; pptx currently placeholder).
- Click Upload to send `multipart/form-data` with field name `file` to grading service `/api/grade`.
- Result JSON displayed (scores, feedback, risks). If schema enforcement fails you may see a fallback structure.

## File Size & Types
- Large files (> ~15MB) may be rejected or slow. Keep decks concise.
- Unsupported types return an error message.

## Adding New API Calls
Use `src/services/api.js` as a pattern:
```js
export async function getHello() { /* ... */ }
```
Add error handling + timeouts for reliability.

## Development Tips
- Hot reload via CRA.
- Inspect network calls in browser DevTools when debugging CORS or fetch issues.
- Keep environment-specific values out of committed source; use `.env.local` for overrides.

## Next Enhancements
- Display grading scores with visual bars.
- Persist grading results to FastAPI backend.
- Auth & protected routes.
- Improved pptx extraction status indicator.

## Scripts
| Script | Purpose |
|--------|---------|
| npm start | Start dev server (port 3000) |
| npm build | Production build (creates `build/`) |
| npm test | Run tests (none yet) |

## Testing (placeholder)
Add React Testing Library & Jest tests under `src/__tests__/`.

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm test
```

## License
Internal MVP; clarify license before external distribution.
