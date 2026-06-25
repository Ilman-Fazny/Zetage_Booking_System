import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.session import SessionLocal
from app.models.booking import Booking

def view():
    db = SessionLocal()
    try:
        bookings = db.query(Booking).all()
        print(f"Total bookings in DB: {len(bookings)}")
        for b in bookings:
            print(f"ID: {b.id}, Ref: {b.booking_ref}, User ID: {b.user_id}, Seat ID: {b.seat_id}, Status: {b.status}, Order ID: {b.order_id}")
    except Exception as e:
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    view()
