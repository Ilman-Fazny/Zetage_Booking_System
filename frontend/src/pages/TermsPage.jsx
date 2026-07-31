import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "../lib/useDocumentTitle";

/* ─── Reuse same visual style as PrivacyPolicyPage ─────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  .pol-root {
    min-height: 100svh;
    width: 100%;
    background-color: #0D0D12;
    background-image:
      radial-gradient(ellipse 80% 60% at 50% -10%, rgba(139, 92, 246, 0.15) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 55%);
    font-family: 'Inter', system-ui, sans-serif;
    color: #c4b9d8;
    position: relative;
    overflow-x: hidden;
  }

  .pol-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    background-size: 180px;
    opacity: 0.35;
    pointer-events: none;
    z-index: 0;
  }

  .pol-header {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(13, 13, 18, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(139, 92, 246, 0.15);
    padding: 16px 24px;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .pol-back-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(139, 92, 246, 0.12);
    border: 1px solid rgba(139, 92, 246, 0.25);
    border-radius: 10px;
    color: #a78bfa;
    padding: 8px 14px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'Inter', system-ui, sans-serif;
    text-decoration: none;
  }

  .pol-back-btn:hover {
    background: rgba(139, 92, 246, 0.22);
    border-color: rgba(139, 92, 246, 0.5);
    transform: translateX(-2px);
  }

  .pol-header-title {
    font-size: 16px;
    font-weight: 600;
    color: #e9d5ff;
    margin: 0;
  }

  .pol-container {
    position: relative;
    z-index: 1;
    max-width: 800px;
    margin: 0 auto;
    padding: 48px 24px 80px;
  }

  .pol-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(139, 92, 246, 0.12);
    border: 1px solid rgba(139, 92, 246, 0.25);
    border-radius: 20px;
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 500;
    color: #a78bfa;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  .pol-title {
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 700;
    color: #f3e8ff;
    letter-spacing: -1px;
    line-height: 1.15;
    margin: 0 0 12px;
  }

  .pol-subtitle {
    font-size: 15px;
    color: #9178b2;
    margin: 0 0 8px;
    line-height: 1.6;
  }

  .pol-updated {
    font-size: 13px;
    color: #5e4d72;
    margin-bottom: 48px;
    padding-bottom: 32px;
    border-bottom: 1px solid rgba(139, 92, 246, 0.1);
  }

  .pol-section {
    margin-bottom: 40px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(139, 92, 246, 0.08);
    border-radius: 16px;
    padding: 28px 32px;
    transition: border-color 0.3s ease;
  }

  .pol-section:hover {
    border-color: rgba(139, 92, 246, 0.18);
  }

  .pol-section-number {
    font-size: 11px;
    font-weight: 600;
    color: #7c3aed;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .pol-section-title {
    font-size: 18px;
    font-weight: 600;
    color: #e9d5ff;
    margin: 0 0 14px;
    line-height: 1.3;
  }

  .pol-section p {
    font-size: 14px;
    line-height: 1.75;
    color: #9178b2;
    margin: 0 0 12px;
  }

  .pol-section p:last-child {
    margin-bottom: 0;
  }

  .pol-section ul {
    padding-left: 0;
    margin: 10px 0;
    list-style: none;
  }

  .pol-section ul li {
    font-size: 14px;
    line-height: 1.7;
    color: #9178b2;
    padding: 6px 0 6px 22px;
    position: relative;
    border-bottom: 1px solid rgba(139, 92, 246, 0.05);
  }

  .pol-section ul li:last-child {
    border-bottom: none;
  }

  .pol-section ul li::before {
    content: '›';
    position: absolute;
    left: 4px;
    color: #7c3aed;
    font-size: 16px;
    font-weight: 700;
  }

  .pol-highlight {
    background: rgba(139, 92, 246, 0.08);
    border-left: 3px solid #7c3aed;
    border-radius: 0 8px 8px 0;
    padding: 14px 18px;
    margin: 14px 0;
    font-size: 13.5px;
    color: #c4b9d8;
    line-height: 1.65;
  }

  .pol-contact-card {
    background: rgba(139, 92, 246, 0.07);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 14px;
    padding: 24px 28px;
    margin-top: 48px;
  }

  .pol-contact-card h3 {
    font-size: 16px;
    font-weight: 600;
    color: #e9d5ff;
    margin: 0 0 12px;
  }

  .pol-contact-card p {
    font-size: 14px;
    color: #9178b2;
    margin: 0 0 6px;
    line-height: 1.6;
  }

  .pol-contact-card a {
    color: #a78bfa;
    text-decoration: none;
  }

  .pol-contact-card a:hover {
    text-decoration: underline;
  }

  .pol-footer {
    text-align: center;
    font-size: 12px;
    color: #3d3050;
    margin-top: 40px;
    padding-top: 24px;
    border-top: 1px solid rgba(139, 92, 246, 0.06);
  }
`;

export default function TermsPage() {
  useDocumentTitle("Terms & Conditions | Zentage Talent Show");

  useEffect(() => {
    const el = document.createElement("style");
    el.id = "pol-styles-terms";
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  const navigate = useNavigate();

  return (
    <div className="pol-root">
      {/* ── Sticky Header ── */}
      <header className="pol-header">
        <button className="pol-back-btn" onClick={() => navigate(-1)} aria-label="Go back">
          ← Back
        </button>
        <span className="pol-header-title">Terms &amp; Conditions</span>
      </header>

      {/* ── Content ── */}
      <main className="pol-container">
        <div className="pol-badge">📋 Legal</div>
        <h1 className="pol-title">Terms &amp; Conditions</h1>
        <p className="pol-subtitle">
          Sasnaka Sansada Talent Show 2026 — Zentage Booking System
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

        {/* Section 3 — from the user's provided content */}
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
