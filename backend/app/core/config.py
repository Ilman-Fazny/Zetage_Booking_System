from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Booking System"
    database_url: str
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    resend_api_key: str
    from_email: str

    class Config:
        env_file = ".env"

settings = Settings()
