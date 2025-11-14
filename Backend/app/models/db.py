from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:password@localhsost:5432/capsight"
#Engine manages connecting to dbs
engine = create_engine(SQLALCHEMY_DATABASE_URL) 

#group together sql updates
SessionLocal = sessionmaker(autocommit = False, autoflush = False, bind = engine)

#schema
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_table():
    Base.metadata.create_all(bind=engine)