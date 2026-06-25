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
    from app.services.booking_service import create_booking
    bookings = create_booking(db, user, data)   # creates all HELD bookings

    seat_count = len(bookings)
    amount = f"{settings.EVENT_PRICE * seat_count}.00"
    order_id = str(uuid.uuid4())[:12].upper()

    # Store order_id on all bookings in this batch
    for booking in bookings:
        booking.order_id = order_id
    db.commit()

    seats_label = ", ".join(b.seat.seat_code for b in bookings)
    payment_hash = generate_payment_hash(order_id, amount)

    return {
        "merchant_id": settings.PAYHERE_MERCHANT_ID,
        "return_url":  f"{settings.FRONTEND_URL}/ticket",
        "cancel_url":  f"{settings.FRONTEND_URL}/payment-cancelled",
        "notify_url":  f"{settings.PAYHERE_NOTIFY_URL}/api/payments/notify",
        "order_id":    order_id,
        "items":       f"Zentage Talent Show — Seats {seats_label}",
        "currency":    "LKR",
        "amount":      amount,
        "first_name":  (user.name.split()[0] if user.name and user.name.split() else "Guest"),
        "last_name":   (" ".join(user.name.split()[1:]) if user.name and len(user.name.split()) > 1 else "."),
        "email":       user.email,
        "phone":       data.phone or "0000000000",
        "address":     data.district,
        "city":        data.district,
        "country":     "Sri Lanka",
        "hash":        payment_hash,
    }


def confirm_payment(db: Session, order_id: str) -> list[Booking]:
    """Called by webhook after successful payment."""
    bookings = db.query(Booking).filter(Booking.order_id == order_id).all()
    if not bookings:
        raise HTTPException(status_code=404, detail="No bookings found for this order.")
    for booking in bookings:
        seat = db.query(Seat).filter(Seat.id == booking.seat_id).first()
        if seat:
            seat.status = SeatStatus.BOOKED
        booking.status = BookingStatus.CONFIRMED
    db.commit()
    for b in bookings:
        db.refresh(b)
        _ = b.seat
        _ = b.user
    return bookings


def release_held_seat(db: Session, order_id: str) -> None:
    """Called by webhook on payment failure, or by cleanup job on timeout."""
    bookings = db.query(Booking).filter(
        Booking.order_id == order_id,
        Booking.status == BookingStatus.PENDING
    ).all()
    for booking in bookings:
        seat = db.query(Seat).filter(Seat.id == booking.seat_id).first()
        if seat:
            seat.status = SeatStatus.AVAILABLE
        booking.status = BookingStatus.CANCELLED
    if bookings:
        db.commit()
