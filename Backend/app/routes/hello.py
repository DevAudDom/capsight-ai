from fastapi import APIRouter

router = APIRouter(tags=["hello"])

@router.get("/hello")
def hello():
    return {"message": "Hello from FastAPI"}
