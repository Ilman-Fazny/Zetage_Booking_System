from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.models.seat import Seat, SeatStatus
from sqlalchemy import func

router = APIRouter(prefix="/availability", tags=["availability"])

@router.get("")
def get_availability(db: Session = Depends(get_db)):
    """Lightweight endpoint for real-time seat availability counts."""
    total_seats = db.query(func.count(Seat.id)).scalar() or 0
    available_seats = db.query(func.count(Seat.id)).filter(Seat.status == SeatStatus.AVAILABLE).scalar() or 0
    
    return {
        "total": total_seats,
        "available": available_seats
    }
