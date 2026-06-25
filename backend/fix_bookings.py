from app.db.session import SessionLocal
from app.models.booking import Booking, BookingStatus

db = SessionLocal()
bookings = db.query(Booking).filter(Booking.status == BookingStatus.CONFIRMED, ~Booking.order_id.like("FREE-%")).all()
count = 0
for b in bookings:
    b.order_id = "FREE-" + (b.order_id if b.order_id else "")
    count += 1
db.commit()
print(f"Updated {count} bookings")
