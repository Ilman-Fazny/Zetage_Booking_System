# models/booking.py
import enum
import uuid
from sqlalchemy import Column, Integer, String, Boolean, Enum as SAEnum
from sqlalchemy import ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base

class BookingStatus(str, enum.Enum):
    PENDING   = "pending"    # payment initiated, not yet confirmed
    CONFIRMED = "confirmed"  # payment successful
    CANCELLED = "cancelled"  # payment failed or timed out

class Booking(Base):
    __tablename__ = "bookings"
    __table_args__ = (
        # one booking per user, enforced at DB level
        UniqueConstraint("user_id", name="uq_one_booking_per_user"),
    )

    id                 = Column(Integer, primary_key=True, index=True)
    booking_ref        = Column(String, unique=True, index=True,
                                default=lambda: str(uuid.uuid4())[:8].upper())
    user_id            = Column(Integer, ForeignKey("users.id"), nullable=False)
    seat_id            = Column(Integer, ForeignKey("seats.id"), nullable=False)

    # attendee details collected after seat selection
    attendee_name      = Column(String, nullable=False, server_default="Unknown")
    district           = Column(String, nullable=False)
    is_sasnaka_member  = Column(Boolean, nullable=False, default=False)
    phone              = Column(String, nullable=True)

    status             = Column(SAEnum(BookingStatus, values_callable=lambda x: [e.value for e in x]),
                                default=BookingStatus.PENDING, nullable=False)
    order_id           = Column(String, unique=True, nullable=True, index=True)
    created_at         = Column(DateTime(timezone=True), server_default=func.now())
    # New attendance tracking fields
    is_entered         = Column(Boolean, default=False, nullable=False)
    entered_at         = Column(DateTime(timezone=True), nullable=True)
    email_sent         = Column(Boolean, default=False, nullable=False)

    user = relationship("User", back_populates="booking")
    seat = relationship("Seat", back_populates="booking")

    @property
    def seat_code(self) -> str:
        return self.seat.seat_code if self.seat else ""

    @property
    def section(self) -> str:
        return self.seat.section.value if self.seat and self.seat.section else ""