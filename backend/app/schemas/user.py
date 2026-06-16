from pydantic import BaseModel, EmailStr

class UserRegister(BaseModel):
    email:    EmailStr
    password: str
    name:     str | None = None

class UserCreate(BaseModel):
    email:    EmailStr
    password: str
    name:     str | None = None

class UserLogin(BaseModel):
    email:    EmailStr
    password: str

class UserOut(BaseModel):
    id:       int
    email:    str
    name:     str | None
    is_admin: bool

    model_config = {"from_attributes": True}

class Token(BaseModel):
    access_token: str
    token_type:   str = "bearer"

class TokenResponse(BaseModel):
    access_token: str
    token_type:   str = "bearer"

class GoogleAuthRequest(BaseModel):
    code: str    # OAuth authorization code from Google