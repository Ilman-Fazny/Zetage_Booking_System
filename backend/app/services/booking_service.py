from sqlalchemy.orm import Session
from sqlalchemy import select
from fastapi import HTTPException, status
from app.models.seat import Seat, SeatStatus
from app.models.booking import Booking, BookingStatus
from app.models.user import User
from app.schemas.booking import BookingCreate
from app.services.email_service import send_booking_confirmation

def create_booking(db: Session, user: User, data: BookingCreate) -> Booking:
    # 1. Reject if user already has a booking
    if user.booking:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You already have a booking. One seat per person."
        )

    # 2. Lock the seat row — SELECT FOR UPDATE prevents double-booking
    seat = (
        db.execute(
            select(Seat)
            .where(Seat.seat_code == data.seat_code)
            .with_for_update()
        )
        .scalars()
        .first()
    )

    if not seat:
        raise HTTPException(status_code=404, detail="Seat not found")

    if seat.status != SeatStatus.AVAILABLE:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="That seat was just taken. Please choose another."
        )

    # 3. Mark seat booked + create booking record — single transaction
    seat.status = SeatStatus.BOOKED
    booking = Booking(
        user_id=user.id,
        seat_id=seat.id,
        district=data.district,
        is_sasnaka_member=data.is_sasnaka_member,
        phone=data.phone,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    db.refresh(seat)

    # Load user for email — booking is committed, this is safe
    from app.models.user import User
    user = db.query(User).filter(User.id == user_id).first()

    background_tasks.add_task(
        send_booking_confirmation,
        to_email=user.email,
        user_name=user.email,
        event_title=event.title,
        event_date=event.event_date.strftime("%B %d, %Y at %I:%M %p"),
        venue=event.venue,
        booking_id=booking.id
    )
    
    return booking

def cancel_booking(db: Session, user: User) -> None:
    booking = user.booking
    if not booking or booking.status == BookingStatus.CANCELLED:
        raise HTTPException(status_code=404, detail="No active booking found")

    # Release seat atomically
    seat = db.query(Seat).filter(Seat.id == booking.seat_id).first()
    if seat:
        seat.status = SeatStatus.AVAILABLE

    booking.status = BookingStatus.CANCELLED
    db.commit()

def get_my_booking(db: Session, user: User) -> Booking | None:
    return user.booking