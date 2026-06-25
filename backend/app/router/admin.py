from fastapi import APIRouter, Depends, Query, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import select
import uuid
from app.dependencies.dependencies import get_db, get_admin_user
from app.services.booking_service import list_bookings, get_booking_stats
from app.services.seat_service import get_seat_map
from app.schemas.booking import AdminBookingOut, BookingStats, AdminBookingCreate
from app.schemas.seat import SeatMapSection, ScanRequest, ScanResponse
from app.schemas.user import UserOut, PromoteRequest
from app.models.user import User
from app.models.booking import Booking, BookingStatus
from app.models.seat import Seat, SeatStatus
from app.services.admin_service import scan_entrance
from app.services.email_service import send_ticket_email_raise, send_ticket_email

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/bookings", response_model=list[AdminBookingOut])
def admin_list_bookings(
    district: str | None = Query(None, description="Filter by district, partial match"),
    is_sasnaka_member: bool | None = Query(None),
    section: str | None = Query(None, description="Filter by seat section"),
    db: Session = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    bookings = list_bookings(db, district=district, is_sasnaka_member=is_sasnaka_member, section=section)
    return [
        AdminBookingOut(
            id=b.id,
            booking_ref=b.booking_ref,
            seat_code=b.seat.seat_code,
            section=b.seat.section.value,
            attendee_name=b.attendee_name,
            district=b.district,
            is_sasnaka_member=b.is_sasnaka_member,
            status=b.status,
            created_at=b.created_at,
            user_email=b.user.email,
            user_name=b.user.name,
            is_entered=b.is_entered,
            entered_at=b.entered_at,
            email_sent=b.email_sent,
        )
        for b in bookings
    ]


@router.get("/stats", response_model=BookingStats)
def admin_stats(
    db: Session = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    return get_booking_stats(db)


@router.get("/seats", response_model=list[SeatMapSection])
def admin_seat_overview(
    db: Session = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    """Same shape as the public seat map, but admin-gated — useful for an admin dashboard view."""
    return get_seat_map(db)


@router.post("/scan", response_model=ScanResponse)
def scan_qr_entrance(
    payload: ScanRequest,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    """
    Scan a QR code at the entrance.
    Marks the seat as attended (one-time only).
    Requires admin JWT.
    """
    return scan_entrance(payload.booking_ref, db)


@router.get("/admins", response_model=list[UserOut])
def list_admins(
    db: Session = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    """List all users who have is_admin = True"""
    return db.query(User).filter(User.is_admin == True).order_by(User.id).all()


@router.post("/promote", response_model=UserOut)
def promote_user_to_admin(
    payload: PromoteRequest,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    """Promote a user by email to be an admin."""
    email_normalized = payload.email.strip().lower()
    user = db.query(User).filter(User.email == email_normalized).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail=f"User with email '{payload.email}' not found"
        )
    
    user.is_admin = True
    db.commit()
    db.refresh(user)
    return user


@router.post("/demote", response_model=UserOut)
def demote_user_from_admin(
    payload: PromoteRequest,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    """Demote a user from being an admin (remove is_admin)."""
    email_normalized = payload.email.strip().lower()
    
    if email_normalized == "ilmanfazny123@gmail.com":
        raise HTTPException(
            status_code=403,
            detail="Cannot demote the superadmin user"
        )
        
    user = db.query(User).filter(User.email == email_normalized).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail=f"User with email '{payload.email}' not found"
        )
    
    user.is_admin = False
    db.commit()
    db.refresh(user)
    return user


@router.post("/bookings/{booking_id}/resend-email")
def resend_booking_email(
    booking_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    """
    Manually resend the ticket email.
    Attempts synchronous delivery; propagates errors to the frontend.
    """
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    user = db.query(User).filter(User.id == booking.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        send_ticket_email_raise(user, booking, db)
    except Exception as e:
        # Catch and return specific Resend API or configuration error
        raise HTTPException(
            status_code=400,
            detail=f"Email delivery failed: {str(e)}"
        )

    return {"detail": "Email resent successfully", "email_sent": True}

@router.post("/book")
def admin_book_seats(
    data: AdminBookingCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    """
    Instantly book seats for an existing user without payment.
    Marks seats as BOOKED, creates CONFIRMED bookings.
    """
    email_normalized = data.user_email.strip().lower()
    user = db.query(User).filter(User.email == email_normalized).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail=f"User with email '{data.user_email}' not found."
        )

    order_id = str(uuid.uuid4())[:12].upper()
    confirmed_bookings = []

    for seat_code in data.seat_codes:
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

        seat.status = SeatStatus.BOOKED
        booking = Booking(
            user_id=user.id,
            seat_id=seat.id,
            attendee_name=user.name or user.email or "Unknown",
            district=data.district,
            is_sasnaka_member=data.is_sasnaka_member,
            phone=None,
            status=BookingStatus.CONFIRMED,
            order_id=order_id,
        )
        db.add(booking)
        confirmed_bookings.append(booking)

    db.commit()

    # Fire background emails for each confirmed booking
    for booking in confirmed_bookings:
        db.refresh(booking)
        background_tasks.add_task(
            send_ticket_email,
            booking.user_id,
            booking.id
        )

    return {"detail": f"Successfully booked {len(data.seat_codes)} seat(s) for {user.email}."}