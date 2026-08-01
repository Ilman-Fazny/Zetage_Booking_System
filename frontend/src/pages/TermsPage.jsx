import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { useAuth } from "../context/AuthContext";

/* Scoped styles */


export default function TermsPage() {
  useDocumentTitle("Terms & Conditions | Zentage Talent Show");

  useEffect(() => {
    const el = document.createElement("style");
    el.id = "pol-styles-terms";
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  const { token } = useAuth();
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(token ? "/" : "/login");
    }
  };

  return (
    <div className="pol-root">
      {/* Header */}
      <header className="pol-header">
        <button className="pol-back-btn" onClick={handleBack} aria-label="Go back">
          ← Back
        </button>
        <span className="pol-header-title">Terms &amp; Conditions</span>
      </header>

      {/* Content */}
      <main className="pol-container">
        <div className="pol-badge">Legal</div>
        <h1 className="pol-title">Terms &amp; Conditions</h1>
        <p className="pol-subtitle">
          Sasnaka Sansada Talent Show 2026 - Zentage Booking System
        </p>
        <p className="pol-updated">Last updated: August 1, 2026</p>

        {/* Section 1 */}
        <div className="pol-section">
          <div className="pol-section-number">Section 01</div>
          <h2 className="pol-section-title">Acceptance of Terms</h2>
          <p>
            By accessing and using the Zentage Ticket Booking System to purchase tickets for the
            Sasnaka Sansada Talent Show 2026, you accept and agree to be bound by these Terms and
            Conditions. If you do not agree to these terms, please do not proceed with your
            booking.
          </p>
        </div>

        {/* Section 2 */}
        <div className="pol-section">
          <div className="pol-section-number">Section 02</div>
          <h2 className="pol-section-title">Ticket Purchase &amp; Seat Reservation</h2>
          <p>
            Tickets are sold on a first-come, first-served basis. Seat reservations are confirmed
            only upon successful payment. A seat is not guaranteed until payment has been completed
            and confirmed.
          </p>
          <ul>
            <li>Each ticket is valid for one (1) person for one (1) entry to the event</li>
            <li>You must provide accurate personal details during the booking process</li>
            <li>Tickets are issued digitally and will be available in your account after payment</li>
            <li>A valid photo ID may be required alongside your ticket for entry verification</li>
          </ul>
        </div>

        {/* Section 3 - from the user's provided content */}
        <div className="pol-section">
          <div className="pol-section-number">Section 03</div>
          <h2 className="pol-section-title">Ticket Sales Are Final</h2>
          <div className="pol-highlight">
            All ticket sales are final. Tickets are non-refundable and non-transferable under any
            circumstances unless the event is cancelled by the organizers.
          </div>
          <p>
            Once a ticket has been purchased, it cannot be exchanged, refunded, or transferred to
            another person. Please review your booking details carefully before completing payment.
          </p>
        </div>

        {/* Section 4 */}
        <div className="pol-section">
          <div className="pol-section-number">Section 04</div>
          <h2 className="pol-section-title">Ticket Validity &amp; Entry</h2>
          <p>
            A valid ticket (QR code or digital/printed copy) must be presented for entry. The
            following conditions apply:
          </p>
          <ul>
            <li>Your digital ticket contains a unique QR code that will be scanned at the entrance</li>
            <li>Screenshots or printed copies of the QR code are accepted</li>
            <li>Duplicate or tampered tickets will be void and refused entry</li>
            <li>Admission may be refused if a valid ticket cannot be presented</li>
            <li>Lost or inaccessible tickets cannot be replaced or refunded</li>
          </ul>
        </div>

        {/* Section 5 */}
        <div className="pol-section">
          <div className="pol-section-number">Section 05</div>
          <h2 className="pol-section-title">Photography &amp; Recording</h2>
          <p>
            The event will be photographed and recorded. By attending the event, you consent to
            the use of your image or video for promotional purposes, including but not limited to:
          </p>
          <ul>
            <li>Social media posts and stories</li>
            <li>Event highlight videos and reels</li>
            <li>Printed promotional materials and posters</li>
            <li>Archival and documentation purposes</li>
          </ul>
          <p>
            No compensation will be provided for the use of such images or footage. If you object
            to being photographed, please notify the event organizers before the event.
          </p>
        </div>

        {/* Section 6 */}
        <div className="pol-section">
          <div className="pol-section-number">Section 06</div>
          <h2 className="pol-section-title">Event Changes &amp; Organizer Rights</h2>
          <p>
            The organizers reserve the right to make necessary changes to the event schedule,
            seating arrangement, or program if required due to unforeseen circumstances including
            but not limited to:
          </p>
          <ul>
            <li>Technical difficulties or venue-related issues</li>
            <li>Performer unavailability or scheduling conflicts</li>
            <li>Safety or security concerns</li>
            <li>Government regulations or force majeure events</li>
          </ul>
          <div className="pol-highlight">
            Ticket holders will be notified of any significant changes via their registered email
            address. Minor program adjustments do not entitle ticket holders to a refund.
          </div>
        </div>

        {/* Section 7 */}
        <div className="pol-section">
          <div className="pol-section-number">Section 07</div>
          <h2 className="pol-section-title">Event Cancellation</h2>
          <p>
            In the unlikely event of full cancellation by the organizers, ticket holders will be
            notified and refund options will be communicated. Refunds will be processed through the
            original payment method where possible.
          </p>
          <p>
            The organizers are not liable for any indirect costs incurred by attendees (e.g., travel,
            accommodation) in connection with event cancellation.
          </p>
        </div>

        {/* Section 8 */}
        <div className="pol-section">
          <div className="pol-section-number">Section 08</div>
          <h2 className="pol-section-title">Code of Conduct</h2>
          <p>
            All attendees are expected to behave respectfully towards fellow attendees, performers,
            and staff. The organizers reserve the right to remove any person from the venue without
            refund if they:
          </p>
          <ul>
            <li>Engage in disruptive, aggressive, or threatening behavior</li>
            <li>Violate venue rules or safety guidelines</li>
            <li>Attempt fraudulent entry with invalid or counterfeit tickets</li>
          </ul>
        </div>

        {/* Section 9 */}
        <div className="pol-section">
          <div className="pol-section-number">Section 09</div>
          <h2 className="pol-section-title">Limitation of Liability</h2>
          <p>
            The organizers and the Zentage platform shall not be held liable for any loss, damage,
            injury, or inconvenience suffered by attendees arising from attendance at the event,
            except where caused by gross negligence or intentional misconduct by the organizers.
          </p>
          <p>
            Attendance at the event is at the attendee's own risk. The organizers are not responsible
            for personal belongings lost, stolen, or damaged at the venue.
          </p>
        </div>

        {/* Section 10 */}
        <div className="pol-section">
          <div className="pol-section-number">Section 10</div>
          <h2 className="pol-section-title">Governing Law</h2>
          <p>
            These Terms and Conditions shall be governed by and construed in accordance with the
            laws of Sri Lanka. Any disputes arising from these terms shall be subject to the
            exclusive jurisdiction of the courts of Sri Lanka.
          </p>
        </div>

        {/* Contact Card */}
        <div className="pol-contact-card">
          <h3>Contact Us</h3>
          <p>For any questions regarding these Terms &amp; Conditions, please contact us:</p>
          <p><strong style={{ color: "#c4b9d8" }}>Organization:</strong> Sasnaka Sansada</p>
          <p><strong style={{ color: "#c4b9d8" }}>Website:</strong> <a href="https://sasnaka.org/" target="_blank" rel="noreferrer">sasnaka.org</a></p>
          <p><strong style={{ color: "#c4b9d8" }}>Event:</strong> Sasnaka Sansada Talent Show 2026</p>
          <p><strong style={{ color: "#c4b9d8" }}>Platform:</strong> Zentage Ticket Booking System</p>
          <p><strong style={{ color: "#c4b9d8" }}>Email:</strong> <a href="mailto:info@sasnaka.org">info@sasnaka.org</a></p>
        </div>

        <div className="pol-footer">
          © 2026 Sasnaka Sansada Talent Show - Zentage Booking System. All rights reserved.
        </div>
      </main>
    </div>
  );
}
