from pydantic import BaseModel, field_validator
from app.models.booking import BookingStatus
from datetime import datetime
from typing import Optional

class BookingCreate(BaseModel):
    seat_codes:        list[str]      # was: seat_code: str
    district:          str
    is_sasnaka_member: bool
    phone:             str | None = None

    @field_validator("seat_codes")
    @classmethod
    def at_least_one(cls, v: list[str]) -> list[str]:
        if not v:
            raise ValueError("Select at least one seat.")
        return v

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
    attendee_name:     str
    district:          str
    is_sasnaka_member: bool
    status:            BookingStatus
    # New attendance fields
    is_entered:        bool
    entered_at:        Optional[datetime] = None
    email_sent:        bool
    phone:             str | None = None
    created_at:        datetime

    model_config = {"from_attributes": True}

class AdminBookingOut(BaseModel):
    id:                int
    booking_ref:       str
    seat_code:         str
    section:           str
    attendee_name:     str
    district:          str
    is_sasnaka_member: bool
    status:            BookingStatus
    created_at:        datetime
    user_email:        str
    user_name:         str | None
    is_entered:        bool
    entered_at:        Optional[datetime] = None
    email_sent:        bool

    model_config = {"from_attributes": True}

class BookingStats(BaseModel):
    total_seats:        int
    booked_seats:        int
    available_seats:     int
    total_revenue:        int          # LKR
    sasnaka_member_count: int
    by_district:          dict[str, int]
    by_section:            dict[str, int]   # booked count per section

class BookingListOut(BaseModel):
    bookings: list[BookingOut]
    total:    int