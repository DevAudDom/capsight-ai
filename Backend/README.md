# CapsightAI Backend (FastAPI)

Quickstart (Windows PowerShell):
- cd Backend
- python -m venv .venv
- . .venv\Scripts\Activate.ps1
- pip install -r requirements.txt
- uvicorn app.main:app --reload

Endpoints:
- GET / -> health/info
- GET /api/hello -> sample JSON response
- Docs: http://127.0.0.1:8000/docs

Structure:
- app/main.py: app instance and router mounting
- app/routes/: path operations (HTTP only)
- app/controllers/: business logic (no HTTP)
- app/models/: Pydantic schemas for request/response
- requirements.txt: dependencies for the virtual environment

Notes:
- Keep routes thin; move logic to controllers for testability.
- Define all I/O shapes in models to leverage validation and OpenAPI.
- Restrict CORS origins before production.
