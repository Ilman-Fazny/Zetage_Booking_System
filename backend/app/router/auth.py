from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_user
from app.schemas.user import UserRegister, UserLogin, TokenResponse, GoogleAuthRequest
from app.services.auth_service import register_user, login_user, verify_google_token, get_or_create_google_user
from app.models.user import User
from pydantic import BaseModel
from app.core.security import create_access_token
from app.core.config import settings
from app.main import limiter

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
@limiter.limit("10/minute")
def register(request: Request, data: UserRegister, db: Session = Depends(get_db)):
    user = register_user(db, data)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )
    return {"message": "Account created", "email": user.email}

@router.post("/login")
@limiter.limit("5/minute")
def login(request: Request, data: UserLogin, db: Session = Depends(get_db)):
    token = login_user(db, data.email, data.password)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    user = db.query(User).filter(User.email == data.email).first()
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "email": user.email, "name": user.name, "is_admin": user.is_admin},
    }

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {"email": current_user.email, "is_admin": current_user.is_admin}

class GoogleTokenRequest(BaseModel):
    credential: str

@router.post("/google")
def google_auth(payload: GoogleTokenRequest, db: Session = Depends(get_db)):
    google_data = verify_google_token(payload.credential)
    user = get_or_create_google_user(db, google_data)
    token = create_access_token({"sub": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "email": user.email, "name": user.name, "is_admin": user.is_admin},
    }