from app.db.session import SessionLocal
from app.models.seat import Seat, SeatStatus
from app.models.booking import Booking, BookingStatus

db = SessionLocal()
seats = db.query(Seat).all()
fixed = 0
for s in seats:
    if s.status in [SeatStatus.BOOKED, SeatStatus.HELD]:
        active_booking = db.query(Booking).filter(Booking.seat_id == s.id, Booking.status.in_([BookingStatus.CONFIRMED, BookingStatus.PENDING])).first()
        if not active_booking:
            s.status = SeatStatus.AVAILABLE
            fixed += 1

db.commit()
print(f"Fixed {fixed} orphaned seats")
