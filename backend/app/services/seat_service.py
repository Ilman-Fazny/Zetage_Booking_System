# app/services/seat_service.py
from sqlalchemy.orm import Session
from app.models.seat import Seat, SeatSection, SeatStatus
from app.schemas.seat import SeatMapSection, SeatOut

def get_seat_map(db: Session) -> list[SeatMapSection]:
    """Return all seats grouped by section."""
    seats = db.query(Seat).order_by(Seat.section, Seat.row, Seat.number).all()
    grouped: dict[SeatSection, list[SeatOut]] = {}
    for seat in seats:
        grouped.setdefault(seat.section, []).append(SeatOut.model_validate(seat))
    return [
        SeatMapSection(section=section, seats=seat_list)
        for section, seat_list in grouped.items()
    ]

def get_seat_by_code(db: Session, seat_code: str) -> Seat | None:
    return db.query(Seat).filter(Seat.seat_code == seat_code).first()