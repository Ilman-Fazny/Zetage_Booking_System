from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.router import auth, events, bookings

app = FastAPI(
    title="Zetage Booking System API",
    description="API for managing bookings in the Zetage Booking System",
    version="1.0.0"
)
#CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# Register routers
app.include_router(auth.router)
app.include_router(events.router)
app.include_router(bookings.router)


@app.get("/")
def read_root():
    return {
        "message": "Welcome to the Zetage Booking System API",
        "docs_url": "/docs"
        }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": settings.app_name}