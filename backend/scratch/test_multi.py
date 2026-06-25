import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.session import SessionLocal
from app.models.user import User
from app.models.seat import Seat, SeatStatus
from app.schemas.booking import BookingCreate
from app.services.payment_service import initiate_payment

def test_multi_booking():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == 8).first()
        seats = db.query(Seat).filter(Seat.status == SeatStatus.AVAILABLE).limit(2).all()
        if len(seats) < 2:
            print("Not enough available seats!")
            return
            
        seat_codes = [s.seat_code for s in seats]
        
        data = BookingCreate(
            seat_codes=seat_codes,
            district="Colombo",
            is_sasnaka_member=False
        )
        print(f"Initiating payment for seats {seat_codes}...")
        result = initiate_payment(db, user, data)
        print("Success! Result:", result)
    except Exception as e:
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_multi_booking()
