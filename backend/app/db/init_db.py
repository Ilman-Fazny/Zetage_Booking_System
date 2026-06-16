from app.db.session import engine, Base
from app.models.user import User
from app.models.seat import Seat
from app.models.booking import Booking

def init_db():
    Base.metadata.create_all(bind=engine)