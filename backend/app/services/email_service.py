import base64
import io
import qrcode
import resend
from app.core.config import settings
from app.models.user import User
from app.models.booking import Booking

resend.api_key = settings.RESEND_API_KEY


def _generate_qr_base64(booking_ref: str) -> str:
    """Generate a QR code for the booking ref, return as base64 PNG string."""
    qr = qrcode.QRCode(version=1, box_size=8, border=2)
    qr.add_data(booking_ref)
    qr.make(fit=True)
    img = qr.make_image(fill_color="blue", back_color="white")

    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode("utf-8")


def _build_ticket_html(user: User, booking: Booking, qr_base64: str) -> str:
    seat = booking.seat
    seat_label = f"{seat.section.value} - {seat.seat_code}"

    return f"""
    <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;
                background:#0f1115;color:#fff;border-radius:16px;overflow:hidden">
      <div style="background:#1a1d24;padding:20px;text-align:center">
        <p style="font-size:11px;letter-spacing:.08em;color:#9aa0ab;margin:0 0 4px">
          {settings.EVENT_NAME.upper()}
        </p>
        <h1 style="font-size:18px;margin:0;color:#fff">Your ticket is confirmed</h1>
      </div>

      <div style="padding:24px;text-align:center">
        <img src="data:image/png;base64,{qr_base64}" width="160" height="160"
             alt="QR code for booking {booking.booking_ref}"
             style="border-radius:8px;background:#fff;padding:8px" />

        <table style="width:100%;margin-top:20px;font-size:13px;color:#d6d9de">
          <tr><td style="padding:6px 0;color:#9aa0ab">Booking ref</td>
              <td style="padding:6px 0;text-align:right;font-weight:600">{booking.booking_ref}</td></tr>
          <tr><td style="padding:6px 0;color:#9aa0ab">Seat</td>
              <td style="padding:6px 0;text-align:right">{seat_label}</td></tr>
          <tr><td style="padding:6px 0;color:#9aa0ab">Date</td>
              <td style="padding:6px 0;text-align:right">{settings.EVENT_DATE}</td></tr>
          <tr><td style="padding:6px 0;color:#9aa0ab">Venue</td>
              <td style="padding:6px 0;text-align:right">{settings.EVENT_VENUE}</td></tr>
          <tr><td style="padding:6px 0;color:#9aa0ab">Name</td>
              <td style="padding:6px 0;text-align:right">{user.name or user.email}</td></tr>
        </table>

        <p style="font-size:11px;color:#6b7280;margin-top:20px">
          Present this QR code at the entrance. One seat per ticket.
        </p>
      </div>
    </div>
    """


def send_ticket_email(user: User, booking: Booking) -> None:
    """Called via BackgroundTasks — failures are logged, never raised to the request."""
    try:
        qr_base64 = _generate_qr_base64(booking.booking_ref)
        html = _build_ticket_html(user, booking, qr_base64)

        resend.Emails.send({
            "from":    settings.EMAIL_FROM,
            "to":      [user.email],
            "subject": f"Your {settings.EVENT_NAME} ticket — {booking.booking_ref}",
            "html":    html,
        })
    except Exception as e:
        # Never let email failure break the booking - just log it
        print(f"[email_service] Failed to send ticket email for booking "
              f"{booking.booking_ref}: {e}")