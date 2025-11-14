from pydantic import BaseModel

class UserBase(BaseModel):
    name: str

class createUser(UserBase):
    company_name: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True   # replaces orm_mode=True in Pydantic v2
