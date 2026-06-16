from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.dependencies.dependencies import get_current_user
from app.services.booking_service import create_booking, cancel_booking, get_my_booking
from app.services.email_service import send_ticket_email
from app.schemas.booking import BookingCreate, BookingOut
from app.models.user import User

router = APIRouter(prefix="/bookings", tags=["bookings"])

@router.post("", response_model=BookingOut)
def book_seat(
    payload: BookingCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booking = create_booking(db, current_user, payload)
    background_tasks.add_task(send_ticket_email, current_user, booking)
    return booking

@router.get("/me", response_model=BookingOut | None)
def my_booking(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_my_booking(db, current_user)

@router.delete("/me")
def cancel_my_booking(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cancel_booking(db, current_user)
    return {"detail": "Booking cancelled. Your seat has been released."}