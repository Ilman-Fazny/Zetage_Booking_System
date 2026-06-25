from sqlalchemy.orm import Session
from sqlalchemy import select
from fastapi import HTTPException, status
from app.models.seat import Seat, SeatStatus
from app.models.booking import Booking, BookingStatus
from app.models.user import User
from app.schemas.booking import BookingCreate
from sqlalchemy import func
from app.models.user import User as UserModel


def create_booking(db: Session, user: User, data: BookingCreate) -> list[Booking]:
    if not data.seat_codes:
        raise HTTPException(status_code=400, detail="No seats selected.")

    # Deduplicate in case frontend sends duplicates
    seat_codes = list(dict.fromkeys(data.seat_codes))
    new_bookings = []

    for seat_code in seat_codes:
        # Lock each seat row individually — SELECT FOR UPDATE
        seat = (
            db.execute(
                select(Seat)
                .where(Seat.seat_code == seat_code)
                .with_for_update()
            )
            .scalars()
            .first()
        )
        if not seat:
            db.rollback()
            raise HTTPException(status_code=404, detail=f"Seat {seat_code} not found.")

        if seat.status != SeatStatus.AVAILABLE:
            db.rollback()
            raise HTTPException(
                status_code=409,
                detail=f"Seat {seat_code} is no longer available."
            )

        seat.status = SeatStatus.HELD
        booking = Booking(
            user_id=user.id,
            seat_id=seat.id,
            attendee_name=user.name or user.email or "Unknown",
            district=data.district,
            is_sasnaka_member=data.is_sasnaka_member,
            phone=data.phone,
            status=BookingStatus.PENDING,
        )
        db.add(booking)
        new_bookings.append((booking, seat))

    db.commit()
    for booking, seat in new_bookings:
        db.refresh(booking)
        db.refresh(seat)
        _ = booking.seat  # force-load relationship

    return [b for b, _ in new_bookings]

def cancel_booking(db: Session, user: User, booking_ref: str) -> None:
    booking = next(
        (b for b in user.bookings if b.booking_ref == booking_ref),
        None
    )
    if not booking or booking.status == BookingStatus.CANCELLED:
        raise HTTPException(status_code=404, detail="Booking not found.")

    # Release seat atomically
    seat = db.query(Seat).filter(Seat.id == booking.seat_id).first()
    if seat:
        seat.status = SeatStatus.AVAILABLE
    booking.status = BookingStatus.CANCELLED
    db.commit()

def get_my_bookings(db: Session, user: User) -> list[Booking]:
    from app.models.booking import BookingStatus
    for b in user.bookings:
        _ = b.seat
    return [
        b for b in user.bookings
        if b.status != BookingStatus.CANCELLED
    ]


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
        .filter(Booking.status.in_([BookingStatus.CONFIRMED, BookingStatus.PENDING]))
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

    paid_bookings_count = confirmed.filter(
        (Booking.order_id == None) | (~Booking.order_id.like("FREE-%"))
    ).count()

    return {
        "total_seats":          total_seats,
        "booked_seats":         booked_seats,
        "available_seats":       total_seats - booked_seats,
        "total_revenue":         paid_bookings_count * settings.event_price,
        "sasnaka_member_count":  sasnaka_count,
        "by_district":            {d: c for d, c in by_district_rows},
        "by_section":              {s.value: c for s, c in by_section_rows},
    }