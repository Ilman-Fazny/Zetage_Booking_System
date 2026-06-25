from pydantic import BaseModel, EmailStr
from datetime import datetime
from app.models.booking import BookingStatus

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

class PromoteRequest(BaseModel):
    email: str

class AdminUserBookingOut(BaseModel):
    booking_ref: str
    seat_code: str
    section: str
    status: BookingStatus

class AdminUserSummaryOut(BaseModel):
    id: int
    name: str | None
    email: str
    is_admin: bool
    created_at: datetime
    booking_count: int
    bookings: list[AdminUserBookingOut]

    model_config = {"from_attributes": True}