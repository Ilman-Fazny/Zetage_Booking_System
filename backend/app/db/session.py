from sqlalchemy import create_engine
from sqlarchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings

#connection pool to PostgreSQL database
engine = create_engine(settings.database_url)

#database session management
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#base class for all database models
class Base(DeclarativeBase):
    pass