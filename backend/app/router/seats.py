from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.services.seat_service import get_seat_map
from app.schemas.seat import SeatMapSection

router = APIRouter(prefix="/seats", tags=["seats"])

@router.get("", response_model=list[SeatMapSection])
def seat_map(db: Session = Depends(get_db)):
    """Public endpoint - returns full seat map with availability."""
    return get_seat_map(db)