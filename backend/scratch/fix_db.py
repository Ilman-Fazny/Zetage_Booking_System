import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.session import SessionLocal
from sqlalchemy import text

def fix_db():
    db = SessionLocal()
    try:
        # Drop the unique index and recreate it as non-unique
        # In PostgreSQL, the index is usually named ix_bookings_order_id
        
        print("Dropping unique constraint on order_id...")
        
        # Try dropping unique constraint if it was created as a constraint
        try:
            db.execute(text("ALTER TABLE bookings DROP CONSTRAINT uq_bookings_order_id;"))
            print("Dropped constraint uq_bookings_order_id.")
        except Exception as e:
            db.rollback()
            
        try:
            db.execute(text("ALTER TABLE bookings DROP CONSTRAINT bookings_order_id_key;"))
            print("Dropped constraint bookings_order_id_key.")
        except Exception as e:
            db.rollback()
            
        # Try dropping the index
        try:
            db.execute(text("DROP INDEX ix_bookings_order_id;"))
            print("Dropped index ix_bookings_order_id.")
        except Exception as e:
            db.rollback()
            print("Could not drop index:", e)
            
        # Recreate the non-unique index
        try:
            db.execute(text("CREATE INDEX ix_bookings_order_id ON bookings(order_id);"))
            print("Created non-unique index ix_bookings_order_id.")
        except Exception as e:
            db.rollback()
            print("Could not create index:", e)

        db.commit()
        print("Database schema successfully modified.")
    except Exception as e:
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_db()
