"""
migrate_seat_tiers.py
One-off migration script that:
  1. Adds the 'tier' column to the existing 'seats' table (if missing)
  2. Assigns the correct tier to each existing seat based on its section/row

Ground Floor rows A-G  -> PREMIUM  (LKR 800)
Ground Floor rows H-Q  -> STANDARD (LKR 600)
All Balcony seats       -> NORMAL   (LKR 500)

Usage:
    python migrate_seat_tiers.py
"""

import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import text, inspect
from app.db.session import SessionLocal, engine

PREMIUM_ROW_LETTERS = set("ABCDEFG")

GROUND_SECTIONS = {"GROUND_FLOOR_CENTER", "GROUND_FLOOR_RIGHT_SIDE"}


def migrate():
    inspector = inspect(engine)
    columns = [c["name"] for c in inspector.get_columns("seats")]

    # Step 1: Add 'tier' column if missing
    if "tier" not in columns:
        print("[1/2] Adding 'tier' column to seats table...")
        with engine.begin() as conn:
            conn.execute(text(
                "ALTER TABLE seats ADD COLUMN tier VARCHAR(10) NOT NULL DEFAULT 'normal'"
            ))
        print("      [OK] Column added.")
    else:
        print("[1/2] 'tier' column already exists -- skipping ALTER.")

    # Step 2: Use raw SQL to assign tiers (avoids SQLAlchemy enum deserialization)
    print("[2/2] Assigning tiers to existing seats...")
    with engine.begin() as conn:
        # First, get all seats via raw SQL
        rows = conn.execute(text("SELECT id, section, row FROM seats")).fetchall()

        premium_count = 0
        standard_count = 0
        normal_count = 0

        for seat_id, section, row_label in rows:
            if section in GROUND_SECTIONS:
                if row_label and row_label[0].upper() in PREMIUM_ROW_LETTERS:
                    tier = "premium"
                    premium_count += 1
                else:
                    tier = "standard"
                    standard_count += 1
            else:
                tier = "normal"
                normal_count += 1

            conn.execute(
                text("UPDATE seats SET tier = :tier WHERE id = :id"),
                {"tier": tier, "id": seat_id}
            )

        print(f"      [OK] Updated {len(rows)} seats:")
        print(f"        Premium  (LKR 800): {premium_count}")
        print(f"        Standard (LKR 600): {standard_count}")
        print(f"        Normal   (LKR 500): {normal_count}")


if __name__ == "__main__":
    migrate()
    print("\n[OK] Migration complete.")
