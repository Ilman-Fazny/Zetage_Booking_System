from sqlalchemy.orm import Session
from sqlalchemy import select
from fastapi import HTTPException, status
from app.models.booking import Booking, BookingStatus
from app.models.event import Event

def create_booking(db: Session, user_id: int, event_id: int) -> Booking:
    # Lock the event row for the duration of this transaction
    event = (
        db.execute(
            select(Event)
            .where(Event.id == event_id)
            .with_for_update()
        )
        .scalars()
        .first()
    )

    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )

    if event.available_seats <= 0:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="No seats available"
        )

    existing = db.query(Booking).filter(
        Booking.user_id == user_id,
        Booking.event_id == event_id,
        Booking.status == BookingStatus.confirmed
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You already have a booking for this event"
        )

    event.available_seats -= 1

    booking = Booking(user_id=user_id, event_id=event_id)
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


def get_user_bookings(db: Session, user_id: int) -> list[Booking]:
    return db.query(Booking).filter(Booking.user_id == user_id).all()


def cancel_booking(db: Session, booking_id: int, user_id: int) -> Booking:
    booking = db.query(Booking).filter(
        Booking.id == booking_id,
        Booking.user_id == user_id
    ).first()

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    if booking.status == BookingStatus.cancelled:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Booking is already cancelled"
        )

    booking.status = BookingStatus.cancelled

    event = db.query(Event).filter(Event.id == booking.event_id).first()
    event.available_seats += 1

    db.commit()
    db.refresh(booking)
    return booking