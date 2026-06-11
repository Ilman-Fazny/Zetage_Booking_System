import resend
from app.core.config import settings

resend.api_key = settings.resend_api_key

def send_booking_confirmation(
    to_email: str,
    user_name: str,
    event_title: str,
    event_date: str,
    venue: str,
    booking_id: int
) -> None:
    html = f"""
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Booking Confirmed</h2>
        <p>Hi {user_name},</p>
        <p>Your seat is confirmed for <strong>{event_title}</strong>.</p>
        <table style="width:100%; border-collapse:collapse; margin: 16px 0;">
            <tr>
                <td style="padding: 8px 0; color: #666;">Event</td>
                <td style="padding: 8px 0;"><strong>{event_title}</strong></td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #666;">Date</td>
                <td style="padding: 8px 0;">{event_date}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #666;">Venue</td>
                <td style="padding: 8px 0;">{venue}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #666;">Booking ID</td>
                <td style="padding: 8px 0;">#{booking_id}</td>
            </tr>
        </table>
        <p style="color: #666; font-size: 13px;">
            To cancel your booking, log in and visit My Bookings.
        </p>
    </div>
    """

    resend.Emails.send({
        "from": settings.from_email,
        "to": to_email,
        "subject": f"Booking Confirmed — {event_title}",
        "html": html,
    })