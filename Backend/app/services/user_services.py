from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import createUser, getUser
# create_user is a function that takes "session" our db connection manager, and "createUser" 
# our pydantic model which serves as a validation tool
def create_user(db: Session, data: createUser):
    user_instance = User(**data.model_dump())
    db.add(user_instance)
    db.commit()
    db.refresh(user_instance)
    return user_instance

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()