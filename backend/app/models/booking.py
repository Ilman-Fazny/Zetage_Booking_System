# models/booking.py
import enum
import uuid
from sqlalchemy import Column, Integer, String, Boolean, Enum as SAEnum
from sqlalchemy import ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class BookingStatus(str, enum.Enum):
    CONFIRMED  = "confirmed"
    CANCELLED  = "cancelled"

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
    district           = Column(String, nullable=False)
    is_sasnaka_member  = Column(Boolean, nullable=False, default=False)
    phone              = Column(String, nullable=True)

    status             = Column(SAEnum(BookingStatus),
                                default=BookingStatus.CONFIRMED, nullable=False)
    created_at         = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="booking")
    seat = relationship("Seat", back_populates="booking")