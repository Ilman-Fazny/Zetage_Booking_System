from pydantic import BaseModel, field_validator
from app.models.booking import BookingStatus

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