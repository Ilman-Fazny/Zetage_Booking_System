from fastapi import APIRouter, Depends, BackgroundTasks, UploadFile, File, HTTPException
import shutil
import os
import uuid
from sqlalchemy.orm import Session
from sqlalchemy import select
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
            "slip_url": b.slip_url,
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

@router.post("/{booking_ref}/upload-slip")
def upload_booking_slip(
    booking_ref: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from app.models.booking import Booking, BookingStatus
    
    # 1. Find the booking
    booking = db.query(Booking).filter(Booking.booking_ref == booking_ref, Booking.user_id == current_user.id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found.")
    
    if booking.status not in [BookingStatus.PENDING, BookingStatus.PENDING_VERIFICATION]:
        raise HTTPException(status_code=400, detail="Cannot upload slip for this booking state.")
        
    # 2. Save the file
    ext = file.filename.split('.')[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join("uploads", filename)
    
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # 3. Update the booking
    booking.slip_url = f"/uploads/{filename}"
    booking.status = BookingStatus.PENDING_VERIFICATION
    db.commit()
    
    return {"detail": "Slip uploaded successfully", "slip_url": booking.slip_url}

from fastapi import Form
from app.models.seat import Seat, SeatStatus

@router.post("/upload-slip-batch")
def upload_booking_slip_batch(
    seat_codes: str = Form(...),
    district: str = Form(...),
    is_sasnaka_member: bool = Form(...),
    phone: str = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from app.models.booking import Booking, BookingStatus
    
    # 1. Parse seat codes
    seat_codes_list = [s.strip() for s in seat_codes.split(",") if s.strip()]
    if not seat_codes_list:
        raise HTTPException(status_code=400, detail="No seats selected.")
        
    # 2. Save the file
    ext = file.filename.split('.')[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join("uploads", filename)
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    slip_url = f"/uploads/{filename}"
    order_id = str(uuid.uuid4())[:12].upper()
    
    new_bookings = []
    
    # 3. Create bookings and lock seats
    for seat_code in seat_codes_list:
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
            user_id=current_user.id,
            seat_id=seat.id,
            attendee_name=current_user.name or current_user.email or "Unknown",
            district=district,
            is_sasnaka_member=is_sasnaka_member,
            phone=phone,
            status=BookingStatus.PENDING_VERIFICATION,
            slip_url=slip_url,
            order_id=order_id
        )
        db.add(booking)
        new_bookings.append(booking)

    db.commit()
    
    return {"detail": "Bookings created and slip uploaded successfully", "order_id": order_id}