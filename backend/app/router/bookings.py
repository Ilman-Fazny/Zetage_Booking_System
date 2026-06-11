from fastapi import APIRouter, Depends, status, BackgroundTasks
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_user
from app.schemas.booking import BookingCreate, BookingResponse
from app.services.booking_service import create_booking, get_user_bookings, cancel_booking
from app.models.user import User

router = APIRouter(prefix="/bookings", tags=["bookings"])

@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def book(
    data: BookingCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_booking(
        db,
        user_id=current_user.id,
        event_id=data.event_id,
        background_tasks=background_tasks
    )

@router.get("/me", response_model=list[BookingResponse])
def my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_user_bookings(db, user_id=current_user.id)

@router.patch("/{booking_id}/cancel", response_model=BookingResponse)
def cancel(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return cancel_booking(db, booking_id=booking_id, user_id=current_user.id)