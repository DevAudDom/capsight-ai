"""
FastAPI application entrypoint.

Structure overview:
- app/main.py: creates the FastAPI instance and mounts routes
- app/routes/: defines path operations (endpoints)
- app/models/: data models (Pydantic schemas)
- app/controllers/: business logic separate from HTTP concerns

Run locally:
    uvicorn app.main:app --reload
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.hello import router as hello_router

app = FastAPI(title="CapsightAI Backend", version="0.1.0")

# CORS allows the React dev server (default http://localhost:3000) to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For demos; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount versioned API routes under /api to clearly separate concerns
app.include_router(hello_router, prefix="/api")

@app.get("/")
def root():
    """Health/info endpoint for quick verification."""
    return {"status": "ok", "service": "capsightai-backend"}


