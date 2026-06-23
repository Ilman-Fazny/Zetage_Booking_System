from sqlalchemy.orm import Session
from sqlalchemy import select
from fastapi import HTTPException, status
from app.models.seat import Seat, SeatStatus
from app.models.booking import Booking, BookingStatus
from app.models.user import User
from app.schemas.booking import BookingCreate
from sqlalchemy import func
from app.models.user import User as UserModel


def create_booking(db: Session, user: User, data: BookingCreate) -> Booking:
    # 1. Reject if user already has a booking
    if user.booking:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You already have a booking. One seat per person."
        )

    # 2. Lock the seat row - SELECT FOR UPDATE prevents double-booking
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

    # 3. Mark seat booked + create booking record - single transaction
    seat.status = SeatStatus.BOOKED
    booking = Booking(
        user_id=user.id,
        seat_id=seat.id,
        attendee_name=user.name or user.email or "Unknown",
        district=data.district,
        is_sasnaka_member=data.is_sasnaka_member,
        phone=data.phone,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    db.refresh(seat)
    _ = booking.seat   # force-load the relationship while the session is still open
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
    booking = user.booking
    if not booking or booking.status == BookingStatus.CANCELLED:
        return None
    # force-load the seat relationship
    _ = booking.seat
    return booking


def list_bookings(
    db: Session,
    district: str | None = None,
    is_sasnaka_member: bool | None = None,
    section: str | None = None,
) -> list[Booking]:
    query = (
        db.query(Booking)
        .join(UserModel, Booking.user_id == UserModel.id)
        .join(Seat, Booking.seat_id == Seat.id)
        .filter(Booking.status == BookingStatus.CONFIRMED)
    )

    if district:
        query = query.filter(Booking.district.ilike(f"%{district}%"))
    if is_sasnaka_member is not None:
        query = query.filter(Booking.is_sasnaka_member == is_sasnaka_member)
    if section:
        query = query.filter(Seat.section == section)

    return query.order_by(Booking.created_at.desc()).all()

def get_booking_stats(db: Session) -> dict:
    total_seats = db.query(Seat).count()
    booked_seats = db.query(Seat).filter(Seat.status == SeatStatus.BOOKED).count()

    confirmed = db.query(Booking).filter(Booking.status == BookingStatus.CONFIRMED)
    sasnaka_count = confirmed.filter(Booking.is_sasnaka_member == True).count()  # noqa: E712

    by_district_rows = (
        db.query(Booking.district, func.count(Booking.id))
        .filter(Booking.status == BookingStatus.CONFIRMED)
        .group_by(Booking.district)
        .all()
    )
    by_section_rows = (
        db.query(Seat.section, func.count(Booking.id))
        .join(Booking, Booking.seat_id == Seat.id)
        .filter(Booking.status == BookingStatus.CONFIRMED)
        .group_by(Seat.section)
        .all()
    )

    from app.core.config import settings

    return {
        "total_seats":          total_seats,
        "booked_seats":         booked_seats,
        "available_seats":       total_seats - booked_seats,
        "total_revenue":         booked_seats * settings.event_price,
        "sasnaka_member_count":  sasnaka_count,
        "by_district":            {d: c for d, c in by_district_rows},
        "by_section":              {s.value: c for s, c in by_section_rows},
    }