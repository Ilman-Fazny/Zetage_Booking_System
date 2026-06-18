from pydantic import BaseModel, field_validator
from app.models.booking import BookingStatus
from datetime import datetime

class BookingCreate(BaseModel):
    seat_code:         str
    district:          str
    is_sasnaka_member: bool
    phone:             str | None = None

    @field_validator("district")
    @classmethod
    def district_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("District is required")
        return v.strip()

class BookingOut(BaseModel):
    id:                int
    booking_ref:       str
    seat_code:         str
    section:           str
    district:          str
    is_sasnaka_member: bool
    status:            BookingStatus

    model_config = {"from_attributes": True}

class AdminBookingOut(BaseModel):
    id:                int
    booking_ref:       str
    seat_code:         str
    section:           str
    district:          str
    is_sasnaka_member: bool
    status:            BookingStatus
    created_at:         datetime
    user_email:        str
    user_name:          str | None

    model_config = {"from_attributes": True}

class BookingStats(BaseModel):
    total_seats:        int
    booked_seats:        int
    available_seats:     int
    total_revenue:        int          # LKR
    sasnaka_member_count: int
    by_district:          dict[str, int]
    by_section:            dict[str, int]   # booked count per section