from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import createUser, getUser
from app.services import user_services
from app.models.db import get_db

router = APIRouter(tags=["user"])


@router.post("/user", response_model=getUser, status_code=201)
def create_user(user_data: createUser, db: Session = Depends(get_db)):
    """Create a new user account."""
    new_user = user_services.create_user(db=db, data=user_data)
    return new_user


@router.get("/user/{user_id}", response_model=getUser)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get user by ID."""
    user = user_services.get_user(db=db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

