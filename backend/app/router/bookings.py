from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_user
from app.services.booking_service import create_booking, cancel_booking, get_my_bookings
from app.services.email_service import send_ticket_email
from app.schemas.booking import BookingCreate, BookingOut
from app.models.user import User

router = APIRouter(prefix="/bookings", tags=["bookings"])

@router.post("", response_model=list[BookingOut])
def book_seat(
    payload: BookingCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from app.models.seat import SeatStatus
    from app.models.booking import BookingStatus
    
    bookings = create_booking(db, current_user, payload)
    return bookings

@router.get("/me", response_model=list[BookingOut])
def my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bookings = get_my_bookings(db, current_user)
    return [
        {
            "id": b.id, "booking_ref": b.booking_ref,
            "seat_code": b.seat.seat_code,
            "section": b.seat.section.value,
            "price": b.seat.price,
            "district": b.district,
            "is_sasnaka_member": b.is_sasnaka_member,
            "phone": b.phone, "status": b.status,
            "created_at": b.created_at,
            "is_entered": b.is_entered,
            "entered_at": b.entered_at,
            "email_sent": b.email_sent,
            "attendee_name": b.attendee_name,
        }
        for b in bookings
    ]

@router.delete("/me/{booking_ref}")
def cancel_one_booking(
    booking_ref: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cancel_booking(db, current_user, booking_ref)
    return {"detail": f"Booking {booking_ref} cancelled."}