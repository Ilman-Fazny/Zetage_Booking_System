# models/user.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id               = Column(Integer, primary_key=True, index=True)
    email            = Column(String, unique=True, index=True, nullable=False)
    name             = Column(String, nullable=True)          # filled by Google OAuth
    hashed_password  = Column(String, nullable=True)          # NULL for Google-only users
    google_id        = Column(String, unique=True, nullable=True, index=True)
    is_active        = Column(Boolean, default=True)
    is_admin         = Column(Boolean, default=False)
    created_at       = Column(DateTime(timezone=True), server_default=func.now())

    booking = relationship("Booking", back_populates="user", uselist=False)