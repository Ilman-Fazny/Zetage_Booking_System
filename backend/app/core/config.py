# app/core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL:        str
    SECRET_KEY:          str
    ALGORITHM:           str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Google OAuth
    GOOGLE_CLIENT_ID:     str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI:  str = "http://localhost:8000/auth/google/callback"

    # Event
    EVENT_NAME:     str = "Zentage Talent Show"
    EVENT_DATE:     str = "September 6, 2026"
    EVENT_VENUE:    str = "Elphinstone Theatre, Maradana"
    EVENT_PRICE:    int = 500   # LKR

    # Email
    SMTP_HOST:     str = ""
    SMTP_PORT:     int = 587
    SMTP_USER:     str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM:    str = ""

    class Config:
        env_file = ".env"

settings = Settings()