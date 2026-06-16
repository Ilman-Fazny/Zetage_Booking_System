# models/seat.py
import enum
from sqlalchemy import Column, Integer, String, Enum as SAEnum, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.session import Base

class SeatStatus(str, enum.Enum):
    AVAILABLE = "available"
    BOOKED    = "booked"
    HELD      = "held"        # reserved briefly during checkout (future use)

class SeatSection(str, enum.Enum):
    GROUND_FLOOR_CENTER      = "Ground Floor Center"
    GROUND_FLOOR_RIGHT_SIDE  = "Ground Floor Right Side"
    BALCONY_LEFT             = "Balcony Left Side"
    BALCONY_RIGHT            = "Balcony Right Side"
    BALCONY_FRONT            = "Balcony Front Side"
    UPPER                    = "Upper"

class Seat(Base):
    __tablename__ = "seats"
    __table_args__ = (
        UniqueConstraint("seat_code", name="uq_seat_code"),
    )

    id          = Column(Integer, primary_key=True, index=True)
    seat_code   = Column(String, unique=True, index=True, nullable=False)
    # e.g. "GFC-A-8", "BL-A-1", "BRS-UA1-2"
    section     = Column(SAEnum(SeatSection), nullable=False)
    row         = Column(String, nullable=True)     # "A", "B", "C" etc — NULL for named blocks
    number      = Column(Integer, nullable=False)
    status      = Column(SAEnum(SeatStatus), default=SeatStatus.AVAILABLE, nullable=False)

    booking = relationship("Booking", back_populates="seat", uselist=False)