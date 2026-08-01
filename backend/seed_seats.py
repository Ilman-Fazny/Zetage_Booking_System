import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from app.db.init_db import Base
from app.db.session import SessionLocal, engine
from app.models.seat import Seat, SeatSection, SeatStatus, SeatTier

def seats_1_to(n, start=1):
    return list(range(start, start + n))

GROUND_FLOOR_LEFT = [
    ("A1", seats_1_to(7)), ("B1", seats_1_to(7)), ("C1", seats_1_to(7)),
    ("D1", seats_1_to(7)), ("E1", seats_1_to(7)), ("F1", seats_1_to(7)),
    ("G1", seats_1_to(7)), ("H1", seats_1_to(7)), ("I1", seats_1_to(7)),
    ("J1", seats_1_to(7)), ("K1", seats_1_to(7)), ("L1", seats_1_to(7)),
    ("M1", seats_1_to(7)), ("N1", seats_1_to(7)),
    ("O1", seats_1_to(7)), ("P1", seats_1_to(6)), ("Q1", seats_1_to(6)),
]

GROUND_FLOOR_CENTER = [
    ("A8", seats_1_to(8, start=8)), ("B8", seats_1_to(8, start=8)),
    ("C8", seats_1_to(8, start=8)), ("D8", seats_1_to(8, start=8)),
    ("E8", seats_1_to(8, start=8)), ("F8", seats_1_to(8, start=8)),
    ("G8", seats_1_to(8, start=8)), ("H8", seats_1_to(8, start=8)),
    ("I8", seats_1_to(8, start=8)), ("J8", seats_1_to(8, start=8)),
    ("K8", seats_1_to(8, start=8)), ("L8", seats_1_to(8, start=8)),
    ("M8", seats_1_to(8, start=8)), ("N8", seats_1_to(8, start=8)),
]

GROUND_FLOOR_RIGHT = [
    ("A16", seats_1_to(7, start=16)), ("B16", seats_1_to(7, start=16)),
    ("C16", seats_1_to(7, start=16)), ("D16", seats_1_to(7, start=16)),
    ("E16", seats_1_to(7, start=16)), ("F16", seats_1_to(7, start=16)),
    ("G16", seats_1_to(7, start=16)), ("H16", seats_1_to(7, start=16)),
    ("I16", seats_1_to(7, start=16)), ("J16", seats_1_to(7, start=16)),
    ("K16", seats_1_to(7, start=16)), ("L16", seats_1_to(7, start=16)),
    ("M16", seats_1_to(7, start=16)), ("N16", seats_1_to(7, start=16)),
    ("O8",  seats_1_to(7, start=8)),
    ("P7",  seats_1_to(6, start=7)),
    ("Q7",  seats_1_to(6, start=7)),
]

# ── Balcony Left Side strips (rotated single columns, top to bottom) ──
BALCONY_LEFT_STRIPS = {
    "UL1":  [5, 6, 7, 8],
    "UL9":  [9, 10, 11, 12],
    "UL13": [17, 18, 19, 20],
    "UL31": [25, 26, 27, 28],
    "UL29": [33, 34, 35, 36],
    "UL37": [37, 38],
}
BALCONY_LEFT_STRIPS_2 = {
    # the second visible column next to each strip above
    "UL1b":  [1, 2, 3, 4],
    "UL13b": [19, 20, 15, 16],
    "UL31b": [22, 23, 24, 29],
    "UL29b": [30, 31, 32, 29],
}

# ── Balcony Right Side strips (mirror of left) ─────────────────────
BALCONY_RIGHT_STRIPS = {
    "UR1":  [5, 6, 7, 8, 9],
    "UR10": [11, 12, 13],
    "UR14": [15, 16, 17, 18],
    "UR22": [23, 24, 25, 26],
    "UR30": [31, 32, 33, 34],
    "UR37": [37, 38],
}
BALCONY_RIGHT_STRIPS_2 = {
    "UR1b":  [1, 2, 3, 4],
    "UR10b": [10],
    "UR14b": [14, 19, 20, 21],
    "UR22b": [22, 27, 28, 29],
    "UR30b": [30, 35, 36, 37],
}

# ── Balcony Front Side (rows UA1-UE1, UA6-UE8, UA19-UE20, total 222) ──
BALCONY_FRONT = [
    ("UA1", seats_1_to(5, start=1)),  ("UB1", seats_1_to(6, start=1)),
    ("UC1", seats_1_to(7, start=1)),  ("UD1", seats_1_to(6, start=1)),
    ("UE1", seats_1_to(7, start=1)),

    ("UA6", seats_1_to(12, start=6)), ("UB7", seats_1_to(12, start=7)),
    ("UC8", seats_1_to(12, start=8)), ("UD7", seats_1_to(12, start=7)),
    ("UE8", seats_1_to(12, start=8)),

    ("UA19", seats_1_to(4, start=19)), ("UB19", seats_1_to(6, start=19)),
    ("UC20", seats_1_to(6, start=20)), ("UD19", seats_1_to(7, start=19)),
    ("UE20", seats_1_to(7, start=20)),
]

# ── Bottom strips (UF/UG/UH/UI rows) ───────────────────────────────
BALCONY_BOTTOM = [
    ("UF1",  seats_1_to(5, start=1)),
    ("UF6",  seats_1_to(6, start=6)),
    ("UG1",  seats_1_to(10, start=1)),
    ("UG11", seats_1_to(5, start=11)),
    ("UG16", seats_1_to(5, start=16)),
    ("UH22", seats_1_to(10, start=22)),

    ("UH1",  seats_1_to(10, start=1)),
    ("UH11", seats_1_to(11, start=11)),
    ("UI1",  seats_1_to(5, start=1)),
    ("UI6",  seats_1_to(19, start=6)),
    ("UH22b", seats_1_to(10, start=22)),
    ("UI25", seats_1_to(5, start=25)),
]


# ── Ground floor premium rows: A through G (front, closest to stage) ──
PREMIUM_ROW_LETTERS = set("ABCDEFG")


def _ground_floor_tier(row_label: str) -> SeatTier:
    """Determine tier from a ground-floor row label like 'A1', 'H8', 'N16'.

    The first character is the row letter (A-Q).
    Rows A-G → PREMIUM (LKR 750)
    Rows H-Q → STANDARD (LKR 600)
    """
    letter = row_label[0].upper()
    if letter in PREMIUM_ROW_LETTERS:
        return SeatTier.PREMIUM
    return SeatTier.STANDARD


def build_seats():
    seats = []
    y = 0

    def add_grid(rows, section, tier_fn=None):
        nonlocal y
        for x, (row_label, nums) in enumerate(rows):
            t = tier_fn(row_label) if tier_fn else SeatTier.NORMAL
            for n in nums:
                seats.append(Seat(
                    seat_code=f"{row_label}-{n}",
                    section=section,
                    row=row_label,
                    number=n,
                    tier=t,
                ))
        y += 1

    # Ground floor — left, center, right blocks all use row-based tier logic
    add_grid(GROUND_FLOOR_LEFT,   SeatSection.GROUND_FLOOR_CENTER,     _ground_floor_tier)
    add_grid(GROUND_FLOOR_CENTER, SeatSection.GROUND_FLOOR_CENTER,     _ground_floor_tier)
    add_grid(GROUND_FLOOR_RIGHT,  SeatSection.GROUND_FLOOR_RIGHT_SIDE, _ground_floor_tier)

    # Balcony strips — all NORMAL
    for strip_dict in (BALCONY_LEFT_STRIPS, BALCONY_LEFT_STRIPS_2):
        for label, nums in strip_dict.items():
            for n in nums:
                seats.append(Seat(seat_code=f"{label}-{n}", section=SeatSection.BALCONY_LEFT, row=label, number=n, tier=SeatTier.NORMAL))

    for strip_dict in (BALCONY_RIGHT_STRIPS, BALCONY_RIGHT_STRIPS_2):
        for label, nums in strip_dict.items():
            for n in nums:
                seats.append(Seat(seat_code=f"{label}-{n}", section=SeatSection.BALCONY_RIGHT, row=label, number=n, tier=SeatTier.NORMAL))

    # Balcony front + bottom — all NORMAL
    add_grid(BALCONY_FRONT,  SeatSection.BALCONY_FRONT)
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
        print(f"[OK] Seeded {len(seats)} seats.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding seats: {e}")
        raise
    finally:
        db.close()


def reset():
    from app.models.booking import Booking
    db = SessionLocal()
    try:
        db.query(Booking).delete()
        db.query(Seat).delete()
        db.commit()
        print("[OK] Cleared all bookings and seats.")
    finally:
        db.close()


if __name__ == "__main__":
    if "--reset" in sys.argv:
        reset()
    seed()