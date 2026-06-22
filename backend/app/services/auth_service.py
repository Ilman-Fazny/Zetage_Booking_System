from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserRegister
from app.core.security import hash_password, verify_password, create_access_token
import httpx
from app.core.config import settings

from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests
from fastapi import HTTPException, status

def verify_google_token(credential: str) -> dict:
    """Verify the ID token sent directly from the frontend's Google button."""
    try:
        payload = google_id_token.verify_oauth2_token(
            credential,
            google_requests.Request(),
            settings.google_client_id,
        )
        return payload   # contains sub (google id), email, name, picture
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token"
        )


def get_or_create_google_user(db, google_data: dict):
    from app.models.user import User

    google_id = google_data["sub"]
    user = db.query(User).filter(User.google_id == google_id).first()
    if not user:
        user = db.query(User).filter(User.email == google_data["email"]).first()
        if user:
            user.google_id = google_id
            user.name = user.name or google_data.get("name")
        else:
            user = User(
                email=google_data["email"],
                name=google_data.get("name"),
                google_id=google_id,
                hashed_password=None,
            )
            db.add(user)
    db.commit()
    db.refresh(user)
    return user

def register_user(db: Session, data: UserRegister) -> User:
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        return None
    user = User(
        email = data.email,
        name = data.name,
        hashed_password = hash_password(data.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def login_user(db: Session, email: str, password: str) -> str | None:
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        return None
    return create_access_token({"sub": user.email})