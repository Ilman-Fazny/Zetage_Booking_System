from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.dependencies.dependencies import get_db, get_admin_user
from app.services.booking_service import list_bookings, get_booking_stats
from app.services.seat_service import get_seat_map
from app.schemas.booking import AdminBookingOut, BookingStats
from app.schemas.seat import SeatMapSection, ScanRequest, ScanResponse
from app.models.user import User
from app.services.admin_service import scan_entrance

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