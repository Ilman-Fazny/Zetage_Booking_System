from app.db.session import engine, Base
from app.models import user  # import so Base knows about the model

def init_db():
    Base.metadata.create_all(bind=engine)