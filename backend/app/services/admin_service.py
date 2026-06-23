from sqlalchemy.orm import Session
from sqlalchemy import select
from datetime import datetime, timezone
from app.models.seat import Seat, SeatStatus
from app.models.booking import Booking, BookingStatus
from app.schemas.seat import ScanResponse
from fastapi import HTTPException

def scan_entrance(booking_ref: str, db: Session) -> ScanResponse:
    # Normalize input reference
    booking_ref_normalized = booking_ref.strip().upper()

    # Use SELECT FOR UPDATE so concurrent scans of same QR are safe
    stmt = (
        select(Seat)
        .join(Booking, Booking.seat_id == Seat.id)
        .where(Booking.booking_ref == booking_ref_normalized)
        .where(Booking.status == BookingStatus.CONFIRMED)
        .with_for_update()
    )
    seat = db.execute(stmt).scalar_one_or_none()

    if not seat:
        # Check if booking exists but is not confirmed/cancelled
        booking_exists = db.query(Booking).filter(Booking.booking_ref == booking_ref_normalized).first()
        if not booking_exists:
            raise HTTPException(status_code=404, detail="Invalid QR code — booking not found")
        if booking_exists.status != BookingStatus.CONFIRMED:
            raise HTTPException(
                status_code=400,
                detail="Booking is not confirmed (booking is cancelled)"
            )
        raise HTTPException(status_code=404, detail="Invalid QR code — booking not found")

    if seat.status != SeatStatus.BOOKED:
        raise HTTPException(
            status_code=400,
            detail="Booking is not confirmed (payment may be incomplete)"
        )

    if seat.attended:
        raise HTTPException(
            status_code=409,
            detail=f"Already checked in at {seat.attended_at.strftime('%I:%M %p') if seat.attended_at else 'earlier'}"
        )

    # Mark attendance
    seat.attended = True
    seat.attended_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(seat)

    return ScanResponse(
        success=True,
        message="Checked in successfully",
        seat_code=seat.seat_code,
        section=seat.section.value,
        attended_at=seat.attended_at,
    )
