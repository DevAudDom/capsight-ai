# CapsightAI Full-Stack Scaffold

This repo provides an educational scaffold with a React frontend and a FastAPI backend. It demonstrates clear structure, routing, and a basic API integration.

## Prerequisites
- Node.js 18+ and npm
- Python 3.10+

## Frontend (React)
Location: `Frontend/`

Setup:
- cd Frontend
- npm install
- npm start

Notes:
- The app expects the backend at `http://127.0.0.1:8000` by default.
- Override via environment: create `Frontend/.env` with `REACT_APP_API_BASE=http://127.0.0.1:8000`.
- Routing is configured in `src/App.js` using React Router.
- Example API call is implemented in `src/services/api.js` and used on the `Home` page.

## Backend (FastAPI)
Location: `Backend/`

Setup (Windows PowerShell):
- cd Backend
- python -m venv .venv
- . .venv\Scripts\Activate.ps1
- pip install -r requirements.txt
- uvicorn app.main:app --reload

Endpoints:
- GET `/` -> health/info
- GET `/api/hello` -> sample JSON
- OpenAPI docs: `http://127.0.0.1:8000/docs`

## Project Structure Overview
- `Frontend/` React app: components, pages, services, styles
- `Backend/` FastAPI app: routes, controllers, models

## Learning Notes
- Frontend: See `src/pages/Home.js` for async data fetching and state handling.
- Backend: See `app/routes/hello.py` (HTTP), `app/controllers/hello_controller.py` (logic), and `app/models/hello.py` (schema).
