from sqlalchemy.orm import Session
from app.models.user import User as UserModel
from app.schemas.user import UserCreate, User
# create_user is a function that takes "session" our db connection manager, and "UserCreate" 
# our pydantic model which serves as a validation tool
def create_user(db: Session, data: UserCreate):
    user_instance = UserModel(**data.model_dump())
    db.add(user_instance)
    db.commit()
    db.refresh(user_instance)
    return user_instance

def get_user(db: Session, user_id: int):
    return db.query(UserModel).filter(UserModel.id == user_id).first()