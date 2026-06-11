from pydantic import BaseModel
from datetime import datetime
from app.models.booking import BookingStatus

class BookingCreate(BaseModel):
    event_id: int

class BookingResponse(BaseModel):
    id: int
    event_id: int
    user_id: int
    status: BookingStatus
    created_at: datetime

    model_config = {"from_attributes": True}