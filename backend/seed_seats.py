import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "app"))

from db.init_db import Base
from db.session import SessionLocal, engine
from models.seat import Seat, SeatSection, SeatStatus

def seats_1_to(n, start=1):
    return list(range(start, n + 1))

GROUND_FLOOR_LEFT = [
    ("A1", seats_1_to(7)), ("B1", seats_1_to(7)), ("C1", seats_1_to(7)),
    ("D1", seats_1_to(7)), ("E1", seats_1_to(7)), ("F1", seats_1_to(7)),
    ("G1", seats_1_to(7)), ("H1", seats_1_to(7)), ("I1", seats_1_to(7)),
    ("J1", seats_1_to(7)), ("K1", seats_1_to(7)), ("L1", seats_1_to(7)),
    ("M1", seats_1_to(7)), ("N1", seats_1_to(7)),
    ("O1", seats_1_to(6)), ("P1", seats_1_to(6)), ("Q1", seats_1_to(6)),
]

GROUND_FLOOR_CENTER = [
    ("A8", seats_1_to(7, start=9)), ("B8", seats_1_to(7, start=9)),
    ("C8", seats_1_to(7, start=9)), ("D8", seats_1_to(7, start=9)),
    ("E8", seats_1_to(7, start=9)), ("F8", seats_1_to(7, start=9)),
    ("G8", seats_1_to(7, start=9)), ("H8", seats_1_to(7, start=9)),
    ("I8", seats_1_to(7, start=9)), ("J8", seats_1_to(7, start=9)),
    ("K8", seats_1_to(7, start=9)),
]

GROUND_FLOOR_RIGHT = [
    ("A16", seats_1_to(6, start=17)), ("B16", seats_1_to(6, start=17)),
    ("C16", seats_1_to(6, start=17)), ("D16", seats_1_to(6, start=17)),
    ("E16", seats_1_to(6, start=17)), ("F16", seats_1_to(6, start=17)),
    ("G16", seats_1_to(6, start=17)), ("H16", seats_1_to(6, start=17)),
    ("I16", seats_1_to(6, start=17)), ("J16", seats_1_to(6, start=17)),
    ("K16", seats_1_to(6, start=17)), ("L16", seats_1_to(6, start=17)),
    ("M16", seats_1_to(6, start=17)), ("N16", seats_1_to(6, start=17)),
    ("O8",  seats_1_to(7, start=8)),
    ("P7",  seats_1_to(5, start=8)),
    ("Q7",  seats_1_to(5, start=8)),
]

# ── Balcony Left Side strips (rotated single columns, top to bottom) ──
BALCONY_LEFT_STRIPS = {
    "UL1":  [5, 6, 7, 8],
    "UL9":  [10, 11, 12],
    "UL13": [17, 18, 19, 20],
    "UL31": [25, 26, 27, 26],   # blueprint shows duplicate-looking nums — flag to verify
    "UL29": [33, 34, 35, 36],
}
BALCONY_LEFT_STRIPS_2 = {
    # the second visible column next to each strip above
    "UL1b":  [1, 2, 3, 4],
    "UL9b":  [9, 14, 15, 16],
    "UL13b": [13, 14, 15, 16],
    "UL31b": [22, 23, 24],
    "UL29b": [30, 31, 32],
}

# ── Balcony Right Side strips (mirror of left) ─────────────────────
BALCONY_RIGHT_STRIPS = {
    "UR1":  [5, 6, 7, 8, 9],
    "UR10": [11, 12, 13],
    "UR14": [15, 19, 16, 17],
    "UR22": [26, 23, 24, 25],
    "UR30": [34, 31, 32, 33],
}
BALCONY_RIGHT_STRIPS_2 = {
    "UR1b":  [1, 2, 3, 4],
    "UR10b": [10],
    "UR14b": [14],
    "UR22b": [27, 28],
    "UR30b": [35, 36, 37],
}

# ── Balcony Front Side (rows UA1-UE1, UA6-UE8, UA19-UE20, total 222) ──
BALCONY_FRONT = [
    ("UA1", seats_1_to(5, start=2)),  ("UB1", seats_1_to(5, start=2)),
    ("UC1", seats_1_to(6, start=2)),  ("UD1", seats_1_to(5, start=2)),
    ("UE1", seats_1_to(6, start=2)),

    ("UA6", seats_1_to(11, start=7)), ("UB7", seats_1_to(11, start=8)),
    ("UC8", seats_1_to(11, start=9)), ("UD7", seats_1_to(11, start=8)),
    ("UE8", seats_1_to(11, start=9)),

    ("UA19", seats_1_to(4, start=19)), ("UB19", seats_1_to(6, start=20)),
    ("UC20", seats_1_to(5, start=21)), ("UD19", seats_1_to(4, start=20)),
    ("UE20", seats_1_to(6, start=21)),
]

# ── Bottom strips (UF/UG/UH/UI rows) ───────────────────────────────
BALCONY_BOTTOM = [
    ("UF1",  seats_1_to(5, start=2)),
    ("UG1",  seats_1_to(9, start=2)),
    ("UG11", seats_1_to(5, start=12)),
    ("UG16", seats_1_to(5, start=17)),
    ("UF6",  seats_1_to(5, start=7)),
    ("UH22", seats_1_to(9, start=22)),

    ("UH1",  seats_1_to(9, start=2)),
    ("UH11", seats_1_to(10, start=12)),
    ("UI1",  seats_1_to(5, start=2)),
    ("UI6",  seats_1_to(13, start=7)),
    ("UH22b", seats_1_to(9, start=22)),
    ("UI25", seats_1_to(5, start=26)),
]


def build_seats():
    seats = []
    y = 0

    def add_grid(rows, section):
        nonlocal y
        for x, (row_label, nums) in enumerate(rows):
            for n in nums:
                seats.append(Seat(
                    seat_code=f"{row_label}-{n}",
                    section=section,
                    row=row_label,
                    number=n,
                ))
        y += 1

    add_grid(GROUND_FLOOR_LEFT, SeatSection.GROUND_FLOOR_CENTER)   # left block reuses center enum below adjusted
    add_grid(GROUND_FLOOR_CENTER, SeatSection.GROUND_FLOOR_CENTER)
    add_grid(GROUND_FLOOR_RIGHT, SeatSection.GROUND_FLOOR_RIGHT_SIDE)

    for strip_dict in (BALCONY_LEFT_STRIPS, BALCONY_LEFT_STRIPS_2):
        for label, nums in strip_dict.items():
            for n in nums:
                seats.append(Seat(seat_code=f"{label}-{n}", section=SeatSection.BALCONY_LEFT, row=label, number=n))

    for strip_dict in (BALCONY_RIGHT_STRIPS, BALCONY_RIGHT_STRIPS_2):
        for label, nums in strip_dict.items():
            for n in nums:
                seats.append(Seat(seat_code=f"{label}-{n}", section=SeatSection.BALCONY_RIGHT, row=label, number=n))

    add_grid(BALCONY_FRONT, SeatSection.BALCONY_FRONT)
    add_grid(BALCONY_BOTTOM, SeatSection.BALCONY_FRONT)

    return seats


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing = db.query(Seat).count()
        if existing > 0:
            print(f"Seats already seeded ({existing} rows). Run with --reset to wipe and reseed.")
            return
        seats = build_seats()
        db.add_all(seats)
        db.commit()
        print(f"✓ Seeded {len(seats)} seats.")
        print(f"  (Blueprint states 645 total — 346 ground floor + 299 balcony)")
        print(f"  If the count doesn't match, edit the layout tables at the top of this file and rerun with --reset.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding seats: {e}")
        raise
    finally:
        db.close()


def reset():
    db = SessionLocal()
    try:
        db.query(Seat).delete()
        db.commit()
        print("✓ Cleared all seats.")
    finally:
        db.close()


if __name__ == "__main__":
    if "--reset" in sys.argv:
        reset()
    seed()