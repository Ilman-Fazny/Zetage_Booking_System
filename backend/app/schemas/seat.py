from pydantic import BaseModel
from app.models.seat import SeatStatus, SeatSection

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