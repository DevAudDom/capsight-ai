from pydantic import BaseModel

class UserBase(BaseModel):
    email: str

class createUser(UserBase):
    password: str

class getUser(UserBase):
    id: int

    class Config:
        from_attributes = True   # replaces orm_mode=True in Pydantic v2
