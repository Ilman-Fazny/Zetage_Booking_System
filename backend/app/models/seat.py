# models/seat.py
import enum
from sqlalchemy import Column, Integer, String, Enum as SAEnum, UniqueConstraint, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base

class SeatStatus(str, enum.Enum):
    AVAILABLE = "available"
    BOOKED    = "booked"
    HELD      = "held"        # reserved briefly during checkout (future use)

class SeatTier(str, enum.Enum):
    PREMIUM  = "premium"    # Ground floor front rows (A-G) — LKR 750
    STANDARD = "standard"   # Ground floor back rows  (H-Q) — LKR 600
    NORMAL   = "normal"     # All balcony sections          — LKR 500

# Tier → price mapping (LKR)
TIER_PRICES = {
    SeatTier.PREMIUM:  750,
    SeatTier.STANDARD: 600,
    SeatTier.NORMAL:   500,
}

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
    tier        = Column(SAEnum(SeatTier, values_callable=lambda x: [e.value for e in x]), default=SeatTier.NORMAL, nullable=False)
    attended    = Column(Boolean, default=False, nullable=False)
    attended_at = Column(DateTime(timezone=True), nullable=True)

    booking = relationship("Booking", back_populates="seat", uselist=False)

    @property
    def price(self) -> int:
        """Return the LKR price for this seat based on its tier."""
        return TIER_PRICES.get(self.tier, 500)