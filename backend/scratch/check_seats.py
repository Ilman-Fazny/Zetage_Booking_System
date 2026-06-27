import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.session import SessionLocal
from app.models.seat import Seat

db = SessionLocal()
try:
    seats = db.query(Seat).limit(20).all()
    print(f"Total seats sample:")
    for s in seats:
        print(f"ID: {s.id}, Code: {s.seat_code}, Section: {s.section}, Status: {s.status}")
finally:
    db.close()
