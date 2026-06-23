from pydantic import BaseModel
from app.models.seat import SeatStatus, SeatSection
from datetime import datetime
from typing import Optional

class SeatOut(BaseModel):
    id:        int
    seat_code: str
    section:   SeatSection
    row:       str | None
    number:    int
    status:    SeatStatus

    model_config = {"from_attributes": True}

class SeatMapSection(BaseModel):
    section: SeatSection
    seats:   list[SeatOut]

class ScanRequest(BaseModel):
    booking_ref: str

class ScanResponse(BaseModel):
    success: bool
    message: str
    seat_code: Optional[str] = None
    section: Optional[str] = None
    attended_at: Optional[datetime] = None