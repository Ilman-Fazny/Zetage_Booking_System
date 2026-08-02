import asyncio
import os
from contextlib import asynccontextmanager
from datetime import datetime, timezone, timedelta
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Global rate limiter (keyed by client IP)
limiter = Limiter(key_func=get_remote_address)

from app.core.config import settings
from app.router import auth, bookings, seats, admin, payments
from app.db.init_db import init_db
from app.models import User, Seat, Booking


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Adds security headers to every response to harden the API against
    clickjacking, MIME-sniffing, cross-origin leakage and info disclosure."""

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        if "server" in response.headers:
            del response.headers["server"]
        return response


async def release_expired_holds():
    """Runs every 30 seconds. Releases seats held > 10 minutes with no payment."""
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
                        compare_time = datetime.utcnow() - timedelta(minutes=10)
                    else:
                        compare_time = datetime.now(timezone.utc) - timedelta(minutes=10)

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

# Disable interactive docs in production to reduce attack surface
_debug = os.getenv("DEBUG", "false").lower() == "true"

app = FastAPI(
    title="Zetage Booking System API",
    description="API for managing bookings in the Zetage Booking System",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if _debug else None,
    redoc_url="/redoc" if _debug else None,
    openapi_url="/openapi.json" if _debug else None,
)

# Attach rate limiter state and 429 error handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Security headers on every response
app.add_middleware(SecurityHeadersMiddleware)

# CORS Configuration — only allow the known frontend origin and needed methods
# NOTE: For production, set FRONTEND_URL in .env to your actual domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL] if settings.FRONTEND_URL else ["http://localhost:5173"],
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept", "X-Requested-With"],
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
    # Don't leak docs_url in production
    return {"message": "Zetage Booking System API"}

@app.get("/api/health")
def health_check():
    # Intentionally minimal — do NOT expose version, DB host, or other internals
    return {"status": "ok"}