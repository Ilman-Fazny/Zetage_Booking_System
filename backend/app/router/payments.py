from fastapi import APIRouter, Depends, Request, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from app.dependencies import get_db, get_current_user
from app.services.payment_service import (
    initiate_payment, confirm_payment,
    release_held_seat, verify_payment_notification
)
from app.services.email_service import send_ticket_email
from app.schemas.booking import BookingCreate
from app.models.user import User

router = APIRouter(prefix="/payments", tags=["payments"])


@router.post("/initiate")
def initiate(
    data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Returns PayHere form params. Frontend posts these directly to PayHere."""
    return initiate_payment(db, current_user, data)


@router.post("/notify")
async def payhere_notify(
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """
    PayHere webhook. No auth header — verified via MD5 hash.
    PayHere sends status_code: 2 = success, 0 = pending, -1 = cancelled, -2 = failed
    """
    payload = dict(await request.form())

    if not verify_payment_notification(payload):
        raise HTTPException(status_code=400, detail="Invalid payment notification.")

    order_id    = payload.get("order_id", "")
    status_code = int(payload.get("status_code", 0))

    if status_code == 2:
        # Payment successful
        booking = confirm_payment(db, order_id)
        background_tasks.add_task(
            send_ticket_email,
            booking.user_id,
            booking.id
        )
    elif status_code in (-1, -2):
        # Payment cancelled or failed — release the held seat
        release_held_seat(db, order_id)

    # PayHere expects a 200 OK with no body
    return {"status": "ok"}
