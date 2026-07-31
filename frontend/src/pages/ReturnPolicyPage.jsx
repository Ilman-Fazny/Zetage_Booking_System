import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { useAuth } from "../context/AuthContext";

/* Scoped styles */
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

  .pol-no-refund-banner {
    background: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 12px;
    padding: 20px 24px;
    margin-bottom: 32px;
    display: flex;
    align-items: flex-start;
    gap: 14px;
  }

  .pol-no-refund-banner .icon {
    font-size: 24px;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .pol-no-refund-banner .content h3 {
    font-size: 15px;
    font-weight: 600;
    color: #fca5a5;
    margin: 0 0 6px;
  }

  .pol-no-refund-banner .content p {
    font-size: 13.5px;
    color: #9c6b6b;
    margin: 0;
    line-height: 1.6;
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

export default function ReturnPolicyPage() {
  useDocumentTitle("Return Policy | Zentage Talent Show");

  useEffect(() => {
    const el = document.createElement("style");
    el.id = "pol-styles-return";
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
        <span className="pol-header-title">Return &amp; Refund Policy</span>
      </header>

      {/* Content */}
      <main className="pol-container">
        <div className="pol-badge">Refunds</div>
        <h1 className="pol-title">Return &amp; Refund Policy</h1>
        <p className="pol-subtitle">
          Sasnaka Sansada Talent Show 2026 - Zentage Booking System
        </p>
        <p className="pol-updated">Last updated: August 1, 2026</p>

        {/* Prominent No-Refund Banner */}
        <div className="pol-no-refund-banner">
          <div className="icon">⚠️</div>
          <div className="content">
            <h3>No Refund Policy</h3>
            <p>
              All ticket sales for the Sasnaka Sansada Talent Show 2026 are final.
              Tickets are non-refundable and non-transferable, except in the case of
              full event cancellation by the organizers.
            </p>
          </div>
        </div>

        {/* Section 1 */}
        <div className="pol-section">
          <div className="pol-section-number">Section 01</div>
          <h2 className="pol-section-title">General Return Policy</h2>
          <p>
            As this is a ticketed live event, all sales are final once payment has been completed
            and confirmed. We do not offer refunds or exchanges under ordinary circumstances because
            event seats are limited and allocated specifically to your booking.
          </p>
          <div className="pol-highlight">
            By completing your purchase, you acknowledge and agree that your ticket is
            non-refundable and non-transferable.
          </div>
        </div>

        {/* Section 2 */}
        <div className="pol-section">
          <div className="pol-section-number">Section 02</div>
          <h2 className="pol-section-title">Non-Refundable Circumstances</h2>
          <p>Refunds will <strong style={{ color: "#e9d5ff" }}>NOT</strong> be issued for:</p>
          <ul>
            <li>Change of personal plans or inability to attend the event</li>
            <li>Accidental duplicate purchases (please contact us immediately)</li>
            <li>Incorrect personal details entered during booking</li>
            <li>Failure to present a valid ticket at the venue entrance</li>
            <li>Being refused entry due to violation of event rules or code of conduct</li>
            <li>Minor program or schedule changes within the event</li>
            <li>Technical issues on the attendee's device preventing ticket access</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="pol-section">
          <div className="pol-section-number">Section 03</div>
          <h2 className="pol-section-title">Event Cancellation Refunds</h2>
          <p>
            In the event that the Sasnaka Sansada Talent Show 2026 is <strong style={{ color: "#e9d5ff" }}>fully cancelled</strong> by
            the organizers, ticket holders will be eligible for a full refund of the ticket price paid.
          </p>
          <ul>
            <li>All affected ticket holders will be notified via their registered email address</li>
            <li>Refunds will be processed through the original payment method (PayHere)</li>
            <li>Processing time may take 7-14 business days depending on your bank or card issuer</li>
            <li>Refunds will cover the ticket face value only - booking fees are non-refundable</li>
          </ul>
          <div className="pol-highlight">
            Partial cancellations (e.g., specific performances cancelled but the event continues)
            do not qualify for refunds.
          </div>
        </div>

        {/* Section 4 */}
        <div className="pol-section">
          <div className="pol-section-number">Section 04</div>
          <h2 className="pol-section-title">Event Postponement</h2>
          <p>
            If the event is postponed to a future date, your ticket will remain valid for the
            rescheduled date. Refunds will not be automatically issued for postponed events.
          </p>
          <p>
            If you are unable to attend the rescheduled date, please contact us within 7 days of
            the postponement announcement to request a refund consideration.
          </p>
        </div>

        {/* Section 5 */}
        <div className="pol-section">
          <div className="pol-section-number">Section 05</div>
          <h2 className="pol-section-title">Payment Disputes</h2>
          <p>
            All payments are processed securely through PayHere. If you believe you have been
            charged incorrectly or experienced a payment error, please contact us immediately
            before initiating any dispute with your bank.
          </p>
          <p>
            Chargebacks initiated without prior contact with our team may result in your account
            being suspended and admission to the event being denied.
          </p>
        </div>

        {/* Section 6 */}
        <div className="pol-section">
          <div className="pol-section-number">Section 06</div>
          <h2 className="pol-section-title">How to Contact Us for Refund Requests</h2>
          <p>
            For eligible refund requests (event cancellation only), please contact us with the
            following information:
          </p>
          <ul>
            <li>Your full name as registered on the platform</li>
            <li>Your registered email address</li>
            <li>Your booking/order reference number</li>
            <li>Reason for refund request</li>
          </ul>
          <p>
            We will respond to all refund inquiries within 3-5 business days.
          </p>
        </div>

        {/* Contact Card */}
        <div className="pol-contact-card">
          <h3>Contact Us</h3>
          <p>For refund inquiries or questions about this policy, please reach out to us:</p>
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
