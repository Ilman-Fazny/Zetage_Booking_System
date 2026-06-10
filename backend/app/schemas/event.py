from pydantic import BaseModel, Field
from datetime import datetime

class EventCreate(BaseModel):
    title: str
    description: str | None = None
    venue: str
    event_date: datetime
    total_seats: int = Field(gt=0)

class EventResponse(BaseModel):
    id: int
    title: str
    description: str | None
    venue: str
    event_date: datetime
    total_seats: int
    available_seats: int
    created_at: datetime

    model_config = {"from_attributes": True}

class EventUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    venue: str | None = None
    event_date: datetime | None = None
    total_seats: int | None = Field(default=None, gt=0)