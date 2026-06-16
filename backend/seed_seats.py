import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "app"))

from db.init_db import Base
from app.db.session import SessionLocal, engine, Base
from app.models.seat import Seat, SeatSection, SeatStatus

def generate_seats():
    seats = []

    # Ground Floor Center (rows A–Q, seats 8–15 approx per row)
    gfc_rows = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q"]
    for row in gfc_rows:
        for num in range(8, 16):
            seats.append(Seat(
                seat_code=f"GFC-{row}-{num}",
                section=SeatSection.GROUND_FLOOR_CENTER,
                row=row, number=num
            ))

    # Ground Floor Right Side (rows A–N, seats 16–22)
    gfr_rows = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N"]
    for row in gfr_rows:
        for num in range(16, 23):
            seats.append(Seat(
                seat_code=f"GFR-{row}-{num}",
                section=SeatSection.GROUND_FLOOR_RIGHT_SIDE,
                row=row, number=num
            ))

    # Balcony Left Side (total 38, rows A–N, seats 1–7 approx)
    bl_rows = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N"]
    for i, row in enumerate(bl_rows):
        count = 3 if i < 2 else (2 if i < 4 else 3)
        for num in range(1, count + 1):
            seats.append(Seat(
                seat_code=f"BL-{row}-{num}",
                section=SeatSection.BALCONY_LEFT,
                row=row, number=num
            ))

    # Balcony Right Side (total 39)
    # Named blocks from blueprint: UA1, UB1, UC1, UD2, UE1, UF1, UG1
    br_blocks = {
        "UA1": 4, "UB1": 4, "UC1": 3,
        "UD2": 3, "UE1": 3, "UF1": 4,
        "UG1": 4, "UH1": 4, "UI1": 4,
        "UI11": 3, "UI16": 3,
    }
    for block, count in br_blocks.items():
        for num in range(1, count + 1):
            seats.append(Seat(
                seat_code=f"BR-{block}-{num}",
                section=SeatSection.BALCONY_RIGHT,
                row=block, number=num
            ))

    # Balcony Front Side (total 222, rows A–E, seats 8–25 range)
    bf_sections = {
        "UB19": 10, "UB20": 11, "UC20": 12, "UC21": 11,
        "UG18": 10, "UG19": 10, "UC23": 8,
        "UG11": 12, "U49": 8, "U66": 8, "UB89": 8, "UB8": 8,
    }
    for block, count in bf_sections.items():
        for num in range(1, count + 1):
            seats.append(Seat(
                seat_code=f"BF-{block}-{num}",
                section=SeatSection.BALCONY_FRONT,
                row=block, number=num
            ))

    # Upper sections (UR1, UR4, URI2, URI4, UL1, UL9, HL2, BIL etc)
    upper_blocks = {
        "UR1": 8, "URI4": 17, "URI12": 10,
        "URI14": 12, "URI19": 13, "UR34": 5,
        "UL1": 8, "UL9": 3, "UL19": 2,
        "HL21": 8, "BIL11": 5,
        "UIL33": 6, "UII1": 4, "UI33": 6,
        "UL16": 6,
    }
    for block, count in upper_blocks.items():
        for num in range(1, count + 1):
            seats.append(Seat(
                seat_code=f"UP-{block}-{num}",
                section=SeatSection.UPPER,
                row=block, number=num
            ))

    return seats

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing = db.query(Seat).count()
        if existing > 0:
            print(f"Seats already seeded ({existing} rows). Skipping.")
            return
        seats = generate_seats()
        db.add_all(seats)
        db.commit()
        print(f"OK: Seeded {len(seats)} seats from Elphinstone blueprint.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding seats: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed()