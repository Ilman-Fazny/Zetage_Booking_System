import hashlib
import uuid
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy import select
from app.core.config import settings
from app.models.seat import Seat, SeatStatus
from app.models.booking import Booking, BookingStatus
from app.models.user import User
from app.schemas.booking import BookingCreate


def _md5(value: str) -> str:
    return hashlib.md5(value.encode()).hexdigest().upper()


def generate_payment_hash(order_id: str, amount: str) -> str:
    """
    PayHere hash formula:
    MD5(merchant_id + order_id + amount + currency +
        MD5(merchant_secret).upper()).upper()
    """
    secret_hash = _md5(settings.PAYHERE_MERCHANT_SECRET)
    raw = (
        settings.PAYHERE_MERCHANT_ID
        + order_id
        + amount
        + "LKR"
        + secret_hash
    )
    return _md5(raw)


def verify_payment_notification(payload: dict) -> bool:
    """Verify that the webhook notification genuinely came from PayHere."""
    merchant_id  = payload.get("merchant_id", "")
    order_id     = payload.get("order_id", "")
    payhere_amount = payload.get("payhere_amount", "")
    currency     = payload.get("payhere_currency", "")
    status_code  = payload.get("status_code", "")
    md5sig       = payload.get("md5sig", "")

    secret_hash = _md5(settings.PAYHERE_MERCHANT_SECRET)
    raw = merchant_id + order_id + payhere_amount + currency + status_code + secret_hash
    expected = _md5(raw)
    return expected == md5sig


def initiate_payment(db: Session, user: User, data: BookingCreate) -> dict:
    """
    Lock the seat as HELD and create a PENDING booking.
    Returns the PayHere form parameters the frontend posts to PayHere.
    """
    # Reject if user already has a confirmed booking
    if user.booking and user.booking.status == BookingStatus.CONFIRMED:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You already have a confirmed booking."
        )

    # Clean up previous unconfirmed or cancelled bookings of this user
    # to prevent unique constraint violation (uq_one_booking_per_user)
    if user.booking:
        old_booking = user.booking
        old_seat = db.query(Seat).filter(Seat.id == old_booking.seat_id).first()
        if old_seat and old_seat.status == SeatStatus.HELD:
            old_seat.status = SeatStatus.AVAILABLE
        db.delete(old_booking)
        db.flush()

    # Lock seat with SELECT FOR UPDATE
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
        raise HTTPException(status_code=404, detail="Seat not found.")

    if seat.status != SeatStatus.AVAILABLE:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="That seat is no longer available."
        )

    # Generate a unique order ID for this payment attempt
    order_id = str(uuid.uuid4())[:12].upper()
    amount   = f"{settings.EVENT_PRICE}.00"

    # Hold the seat and create a PENDING booking
    seat.status = SeatStatus.HELD
    booking = Booking(
        user_id=user.id,
        seat_id=seat.id,
        attendee_name=user.name or user.email or "Unknown",
        district=data.district,
        is_sasnaka_member=data.is_sasnaka_member,
        phone=data.phone,
        status=BookingStatus.PENDING,
        order_id=order_id,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)

    payment_hash = generate_payment_hash(order_id, amount)

    return {
        "merchant_id":   settings.PAYHERE_MERCHANT_ID,
        "return_url":    f"{settings.FRONTEND_URL}/ticket",
        "cancel_url":    f"{settings.FRONTEND_URL}/payment-cancelled",
        "notify_url":    f"{settings.FRONTEND_URL.replace('5173', '8000')}/api/payments/notify",
        "order_id":      order_id,
        "items":         f"Zentage Talent Show — Seat {data.seat_code}",
        "currency":      "LKR",
        "amount":        amount,
        "first_name":    (user.name or "").split()[0] or "Guest",
        "last_name":     " ".join((user.name or "Guest").split()[1:]) or ".",
        "email":         user.email,
        "phone":         data.phone or "0000000000",
        "address":       data.district,
        "city":          data.district,
        "country":       "Sri Lanka",
        "hash":          payment_hash,
    }


def confirm_payment(db: Session, order_id: str) -> Booking:
    """Called by webhook after successful payment."""
    booking = db.query(Booking).filter(Booking.order_id == order_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found.")

    seat = db.query(Seat).filter(Seat.id == booking.seat_id).first()
    if seat:
        seat.status = SeatStatus.BOOKED
    booking.status   = BookingStatus.CONFIRMED
    db.commit()
    db.refresh(booking)
    return booking


def release_held_seat(db: Session, order_id: str) -> None:
    """Called by webhook on payment failure, or by cleanup job on timeout."""
    booking = db.query(Booking).filter(Booking.order_id == order_id).first()
    if not booking or booking.status != BookingStatus.PENDING:
        return
    seat = db.query(Seat).filter(Seat.id == booking.seat_id).first()
    if seat:
        seat.status = SeatStatus.AVAILABLE
    booking.status = BookingStatus.CANCELLED
    db.commit()
