from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_user, get_current_admin
from app.schemas.event import EventCreate, EventResponse, EventUpdate
from app.services.event_service import (
    create_event, get_events, get_event, update_event, delete_event
)
from app.models.user import User

router = APIRouter(prefix="/events", tags=["events"])

@router.get("/", response_model=list[EventResponse])
def list_events(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    return get_events(db, skip=skip, limit=limit)

@router.get("/{event_id}", response_model=EventResponse)
def retrieve_event(event_id: int, db: Session = Depends(get_db)):
    event = get_event(db, event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    return event

@router.post("/", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
def create(
    data: EventCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    return create_event(db, data)

@router.patch("/{event_id}", response_model=EventResponse)
def update(
    event_id: int,
    data: EventUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    event = update_event(db, event_id, data)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    return event

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(
    event_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    if not delete_event(db, event_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")