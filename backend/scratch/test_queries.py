import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.session import SessionLocal
from app.models.user import User
from app.models.seat import Seat, SeatStatus, SeatSection
from app.models.booking import Booking, BookingStatus
import uuid

def test():
    db = SessionLocal()
    try:
        # Get or create user
        user = db.query(User).first()
        if not user:
            user = User(email="test@example.com", name="Test User")
            db.add(user)
            db.commit()
            db.refresh(user)

        # Get or create seat
        seat = db.query(Seat).first()
        if not seat:
            seat = Seat(seat_code="TEST-1", section=SeatSection.GROUND_FLOOR_CENTER, number=1)
            db.add(seat)
            db.commit()
            db.refresh(seat)
            
        # Create booking
        booking = Booking(
            user_id=user.id,
            seat_id=seat.id,
            attendee_name="Test",
            district="Colombo",
            is_sasnaka_member=False,
            status=BookingStatus.PENDING,
            order_id=str(uuid.uuid4())[:12]
        )
        db.add(booking)
        db.commit()
        db.refresh(booking)
        
        print("Booking created!")
        print("Booking section:", booking.seat.section)
        try:
            print("Booking section value:", booking.seat.section.value)
        except Exception as e:
            print("Error getting value:", e)
            
        # cleanup
        db.delete(booking)
        db.commit()
    except Exception as e:
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test()
