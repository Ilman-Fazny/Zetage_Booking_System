import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { useAuth } from "../context/AuthContext";

/* Scoped styles */


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
