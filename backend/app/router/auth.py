from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_user
from app.schemas.user import UserRegister, UserLogin, TokenResponse, GoogleAuthRequest
from app.services.auth_service import register_user, login_user, exchange_google_code, get_or_create_google_user
from app.models.user import User
from app.core.security import create_access_token
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

GOOGLE_AUTH_URL = (
    "https://accounts.google.com/o/oauth2/v2/auth"
    "?response_type=code"
    "&scope=openid+email+profile"
    f"&client_id={settings.google_client_id}"
    f"&redirect_uri={settings.google_redirect_uri}"
)

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(data: UserRegister, db: Session = Depends(get_db)):
    user = register_user(db, data)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )
    return {"message": "Account created", "email": user.email}

@router.post("/login", response_model=TokenResponse)
def login(data: UserLogin, db: Session = Depends(get_db)):
    token = login_user(db, data.email, data.password)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {"email": current_user.email, "is_admin": current_user.is_admin}

@router.get("/google")
def google_login():
    """Redirect browser to Google's consent screen."""
    return RedirectResponse(GOOGLE_AUTH_URL)

@router.get("/google/callback")
async def google_callback(code: str, db: Session = Depends(get_db)):
    google_data = await exchange_google_code(code)
    user = get_or_create_google_user(db, google_data)
    token = create_access_token({"sub": str(user.id)})
    # In production redirect to frontend with token in query param
    return {"access_token": token, "token_type": "bearer"}