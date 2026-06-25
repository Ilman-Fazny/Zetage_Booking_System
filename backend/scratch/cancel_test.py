import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.session import SessionLocal
from app.models.user import User
from app.models.seat import Seat, SeatStatus, SeatSection
from app.models.booking import Booking, BookingStatus
import uuid

db = SessionLocal()
try:
    # 1. Get or create user
    user = db.query(User).filter(User.email == "test_cancel@example.com").first()
    if not user:
        user = User(email="test_cancel@example.com", name="Test Cancel User")
        db.add(user)
        db.commit()
        db.refresh(user)

    # 2. Get or create 2 seats
    seat1 = db.query(Seat).filter(Seat.seat_code == "T-CANCEL-1").first()
    if not seat1:
        seat1 = Seat(seat_code="T-CANCEL-1", section=SeatSection.GROUND_FLOOR_CENTER, number=101)
        db.add(seat1)
    seat2 = db.query(Seat).filter(Seat.seat_code == "T-CANCEL-2").first()
    if not seat2:
        seat2 = Seat(seat_code="T-CANCEL-2", section=SeatSection.GROUND_FLOOR_CENTER, number=102)
        db.add(seat2)
    db.commit()
    db.refresh(seat1)
    db.refresh(seat2)

    seat1.status = SeatStatus.BOOKED
    seat2.status = SeatStatus.BOOKED

    # 3. Create 2 confirmed bookings
    b1 = Booking(
        user_id=user.id,
        seat_id=seat1.id,
        attendee_name="Attendee 1",
        district="Colombo",
        is_sasnaka_member=False,
        status=BookingStatus.CONFIRMED,
        order_id="TEST-ORDER"
    )
    b2 = Booking(
        user_id=user.id,
        seat_id=seat2.id,
        attendee_name="Attendee 2",
        district="Colombo",
        is_sasnaka_member=False,
        status=BookingStatus.CONFIRMED,
        order_id="TEST-ORDER"
    )
    db.add(b1)
    db.add(b2)
    db.commit()
    db.refresh(b1)
    db.refresh(b2)

    print(f"Booking 1: Ref={b1.booking_ref}, Status={b1.status}")
    print(f"Booking 2: Ref={b2.booking_ref}, Status={b2.status}")

    # 4. Cancel Booking 1 using the admin_cancel_booking logic
    ref_to_cancel = b1.booking_ref
    print(f"\nCancelling Booking 1 with Ref={ref_to_cancel}...")
    
    booking_to_cancel = db.query(Booking).filter(Booking.booking_ref == ref_to_cancel).first()
    if booking_to_cancel:
        seat = db.query(Seat).filter(Seat.id == booking_to_cancel.seat_id).first()
        if seat:
            seat.status = SeatStatus.AVAILABLE
        booking_to_cancel.status = BookingStatus.CANCELLED
        db.commit()

    # 5. Refresh and print status
    db.refresh(b1)
    db.refresh(b2)
    db.refresh(seat1)
    db.refresh(seat2)

    print(f"\nAfter cancellation:")
    print(f"Booking 1: Ref={b1.booking_ref}, Status={b1.status}, Seat Status={seat1.status}")
    print(f"Booking 2: Ref={b2.booking_ref}, Status={b2.status}, Seat Status={seat2.status}")

    # Cleanup
    db.delete(b1)
    db.delete(b2)
    db.delete(user)
    db.delete(seat1)
    db.delete(seat2)
    db.commit()
    print("\nCleanup completed.")

except Exception as e:
    import traceback
    traceback.print_exc()
finally:
    db.close()
