"""
migrate_db_schema.py
Migration script to update the database schema:
  - Adds missing columns to the 'bookings' table ('slip_url', 'is_entered', 'entered_at', 'email_sent')
  - Adds missing columns to the 'seats' table ('tier', 'attended', 'attended_at')

Usage:
    python migrate_db_schema.py
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import text, inspect
from app.db.session import engine
from app.db.init_db import init_db

def migrate():
    # First ensure all tables defined in models are created
    print("Checking / initializing tables...")
    init_db()
    
    inspector = inspect(engine)
    
    # 1. Update 'bookings' table
    if "bookings" in inspector.get_table_names():
        booking_columns = [c["name"] for c in inspector.get_columns("bookings")]
        
        # slip_url
        if "slip_url" not in booking_columns:
            print("Adding 'slip_url' column to bookings table...")
            with engine.begin() as conn:
                conn.execute(text("ALTER TABLE bookings ADD COLUMN slip_url VARCHAR"))
            print("      [OK] Added 'slip_url'.")
            
        # is_entered
        if "is_entered" not in booking_columns:
            print("Adding 'is_entered' column to bookings table...")
            with engine.begin() as conn:
                conn.execute(text("ALTER TABLE bookings ADD COLUMN is_entered BOOLEAN NOT NULL DEFAULT FALSE"))
            print("      [OK] Added 'is_entered'.")
            
        # entered_at
        if "entered_at" not in booking_columns:
            print("Adding 'entered_at' column to bookings table...")
            with engine.begin() as conn:
                conn.execute(text("ALTER TABLE bookings ADD COLUMN entered_at TIMESTAMP WITH TIME ZONE"))
            print("      [OK] Added 'entered_at'.")
            
        # email_sent
        if "email_sent" not in booking_columns:
            print("Adding 'email_sent' column to bookings table...")
            with engine.begin() as conn:
                conn.execute(text("ALTER TABLE bookings ADD COLUMN email_sent BOOLEAN NOT NULL DEFAULT FALSE"))
            print("      [OK] Added 'email_sent'.")
            
    # 2. Update 'seats' table
    if "seats" in inspector.get_table_names():
        seat_columns = [c["name"] for c in inspector.get_columns("seats")]
        
        # tier
        if "tier" not in seat_columns:
            print("Adding 'tier' column to seats table...")
            with engine.begin() as conn:
                conn.execute(text("ALTER TABLE seats ADD COLUMN tier VARCHAR(10) NOT NULL DEFAULT 'normal'"))
            print("      [OK] Added 'tier'.")
            
        # attended
        if "attended" not in seat_columns:
            print("Adding 'attended' column to seats table...")
            with engine.begin() as conn:
                conn.execute(text("ALTER TABLE seats ADD COLUMN attended BOOLEAN NOT NULL DEFAULT FALSE"))
            print("      [OK] Added 'attended'.")
            
        # attended_at
        if "attended_at" not in seat_columns:
            print("Adding 'attended_at' column to seats table...")
            with engine.begin() as conn:
                conn.execute(text("ALTER TABLE seats ADD COLUMN attended_at TIMESTAMP WITH TIME ZONE"))
            print("      [OK] Added 'attended_at'.")

    print("\nDatabase schema check and migration complete.")

if __name__ == "__main__":
    migrate()
