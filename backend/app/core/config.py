# app/core/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "Zetage Booking System"
    database_url: str
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # Google OAuth
    google_client_id: str = ""
    google_client_secret: str = ""
    google_redirect_uri: str = "http://localhost:8000/auth/google/callback"

    # Event
    event_name: str = "Zentage Talent Show"
    event_date: str = "September 6, 2026"
    event_venue: str = "Elphinstone Theatre, Maradana"
    event_price: int = 500   # LKR

    # Resend Email
    resend_api_key: str = ""
    from_email: str = "onboarding@resend.dev"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

settings = Settings()