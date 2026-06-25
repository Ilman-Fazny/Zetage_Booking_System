import asyncio
from contextlib import asynccontextmanager
from datetime import datetime, timezone, timedelta
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.router import auth, bookings, seats, admin, payments
from app.db.init_db import init_db
from app.models import User, Seat, Booking

async def release_expired_holds():
    """Runs every 30 seconds. Releases seats held > 1 minute with no payment."""
    while True:
        try:
            await asyncio.sleep(30)  # 30 seconds
            from app.db.session import SessionLocal
            from app.models.booking import Booking, BookingStatus
            from app.models.seat import Seat, SeatStatus
            db = SessionLocal()
            try:
                expired = (
                    db.query(Booking)
                    .filter(Booking.status == BookingStatus.PENDING)
                    .all()
                )
                released_count = 0
                for booking in expired:
                    b_time = booking.created_at
                    if not b_time:
                        continue
                    if b_time.tzinfo is None:
                        compare_time = datetime.utcnow() - timedelta(minutes=1)
                    else:
                        compare_time = datetime.now(timezone.utc) - timedelta(minutes=1)

                    if b_time < compare_time:
                        seat = db.query(Seat).filter(Seat.id == booking.seat_id).first()
                        if seat:
                            seat.status = SeatStatus.AVAILABLE
                        booking.status = BookingStatus.CANCELLED
                        released_count += 1

                if released_count > 0:
                    db.commit()
                    print(f"[cleanup] Released {released_count} expired seat holds.")
            except Exception as e:
                print(f"[cleanup] Error in DB session: {e}")
            finally:
                db.close()
        except asyncio.CancelledError:
            break
        except Exception as e:
            print(f"[cleanup] Global error: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    init_db()
    task = asyncio.create_task(release_expired_holds())
    yield
    # Shutdown logic
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        pass

app = FastAPI(
    title="Zetage Booking System API",
    description="API for managing bookings in the Zetage Booking System",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
# NOTE: For production, set FRONTEND_URL in .env to your actual domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL] if settings.FRONTEND_URL else ["http://localhost:5173"],
    allow_methods=["*"], 
    allow_headers=["*"],
    allow_credentials=True,
)

# Register routers
app.include_router(auth.router, prefix="/api")
app.include_router(bookings.router, prefix="/api")
app.include_router(seats.router, prefix="/api")
app.include_router(admin.router,    prefix="/api")
app.include_router(payments.router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "message": "Welcome to the Zetage Booking System API",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": settings.app_name}