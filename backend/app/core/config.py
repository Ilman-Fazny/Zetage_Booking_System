# app/core/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator

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
    price_premium:  int = 750   # LKR — Ground floor front rows
    price_standard: int = 600   # LKR — Ground floor back rows
    price_normal:   int = 500   # LKR — Balcony seats

    # PayHere Integration
    PAYHERE_MERCHANT_ID:     str = ""
    PAYHERE_MERCHANT_SECRET: str = ""
    PAYHERE_BASE_URL:        str = "https://sandbox.payhere.lk/pay/checkout"
    PRICE_PREMIUM:           int = 750
    PRICE_STANDARD:          int = 600
    PRICE_NORMAL:            int = 500
    FRONTEND_URL:            str = "http://localhost:5173"
    PAYHERE_NOTIFY_URL:      str = "http://localhost:8000"

    # Resend Email
    resend_api_key: str = ""
    from_email: str = "onboarding@resend.dev"
    EMAIL_FROM: str = "onboarding@resend.dev"

    # Event Upper Case Aliases (used in multi-booking templates)
    EVENT_NAME: str = "Zentage Talent Show"
    EVENT_DATE: str = "September 6, 2026"
    EVENT_VENUE: str = "Elphinstone Theatre, Maradana"

    @field_validator("database_url", mode="before")
    @classmethod
    def fix_postgres_scheme(cls, v: str) -> str:
        if isinstance(v, str) and v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql://", 1)
        return v

    @field_validator("secret_key")
    @classmethod
    def secret_key_must_be_strong(cls, v: str) -> str:
        weak_defaults = {
            "your-super-secret-key-change-this",
            "your-super-secret-key-change-in-production",
            "secret",
            "changeme",
            "",
        }
        if v.lower() in weak_defaults or len(v) < 32:
            raise ValueError(
                "SECRET_KEY is too weak or is a default placeholder. "
                "Generate one with: python -c \"import secrets; print(secrets.token_hex(32))\""
            )
        return v

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

settings = Settings()