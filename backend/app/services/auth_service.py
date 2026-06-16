from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserRegister
from app.core.security import hash_password, verify_password, create_access_token
import httpx
from app.core.config import settings

GOOGLE_TOKEN_URL    = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"

async def exchange_google_code(code: str) -> dict:
    """Exchange the OAuth authorization code for user info."""
    async with httpx.AsyncClient() as client:
        token_res = await client.post(GOOGLE_TOKEN_URL, data={
            "code":          code,
            "client_id":     settings.google_client_id,
            "client_secret": settings.google_client_secret,
            "redirect_uri":  settings.google_redirect_uri,
            "grant_type":    "authorization_code",
        })
        token_res.raise_for_status()
        access_token = token_res.json()["access_token"]

        user_res = await client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {access_token}"}
        )
        user_res.raise_for_status()
        return user_res.json()   # { id, email, name, picture }

def get_or_create_google_user(db, google_data: dict):
    from app.models.user import User
    from app.db.session import SessionLocal

    user = db.query(User).filter(User.google_id == google_data["id"]).first()
    if not user:
        # check if email already registered manually
        user = db.query(User).filter(User.email == google_data["email"]).first()
        if user:
            user.google_id = google_data["id"]
            user.name = user.name or google_data.get("name")
        else:
            user = User(
                email=google_data["email"],
                name=google_data.get("name"),
                google_id=google_data["id"],
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