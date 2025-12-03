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

from app.routes.deck import router as deck_router
from app.routes.user import router as user_router

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
app.include_router(deck_router, prefix="/api")
app.include_router(user_router, prefix="/api")
@app.get("/")
def root():
    """Health/info endpoint for quick verification."""
    return {"status": "ok", "service": "capsightai-backend"}

@app.on_event("startup")
def log_routes():
    # Print the registered routes for diagnostics
    from fastapi.routing import APIRoute
    route_paths = []
    for route in app.router.routes:
        if isinstance(route, APIRoute):
            methods = "/".join(sorted(route.methods))
            route_paths.append(f"{methods} {route.path}")
    print("[startup] Registered routes:\n" + "\n".join(route_paths))
    print("[startup] Server should be reachable at http://127.0.0.1:8000 (or http://localhost:8000)")


