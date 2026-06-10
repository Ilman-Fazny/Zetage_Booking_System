from sqlalchemy.orm import Session
from app.models.event import Event
from app.schemas.event import EventCreate, EventUpdate

def create_event(db: Session, data: EventCreate) -> Event:
    event = Event(
        **data.model_dump(),
        available_seats=data.total_seats
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

def get_events(db: Session, skip: int = 0, limit: int = 20) -> list[Event]:
    return db.query(Event).offset(skip).limit(limit).all()

def get_event(db: Session, event_id: int) -> Event | None:
    return db.query(Event).filter(Event.id == event_id).first()

def update_event(db: Session, event_id: int, data: EventUpdate) -> Event | None:
    event = get_event(db, event_id)
    if not event:
        return None
    updates = data.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(event, field, value)
    db.commit()
    db.refresh(event)
    return event

def delete_event(db: Session, event_id: int) -> bool:
    event = get_event(db, event_id)
    if not event:
        return False
    db.delete(event)
    db.commit()
    return True