from fastapi.responses import RedirectResponse
from app.services.auth_service import exchange_google_code, get_or_create_google_user
from app.schemas.user import GoogleAuthRequest
from app.core.config import settings

GOOGLE_AUTH_URL = (
    "https://accounts.google.com/o/oauth2/v2/auth"
    "?response_type=code"
    "&scope=openid+email+profile"
    f"&client_id={settings.GOOGLE_CLIENT_ID}"
    f"&redirect_uri={settings.GOOGLE_REDIRECT_URI}"
)

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