import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { useAuth } from "../context/AuthContext";

/* Scoped styles */


export default function PrivacyPolicyPage() {
  useDocumentTitle("Privacy Policy | Zentage Talent Show");

  useEffect(() => {
    const el = document.createElement("style");
    el.id = "pol-styles-privacy";
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
        <span className="pol-header-title">Privacy Policy</span>
      </header>

      {/* Content */}
      <main className="pol-container">
        <div className="pol-badge">Legal</div>
        <h1 className="pol-title">Privacy Policy</h1>
        <p className="pol-subtitle">
          Sasnaka Sansada Talent Show 2026 - Zentage Booking System
        </p>
        <p className="pol-updated">Last updated: August 1, 2026</p>

        {/* Section 1 */}
        <div className="pol-section">
          <div className="pol-section-number">Section 01</div>
          <h2 className="pol-section-title">Introduction</h2>
          <p>
            Welcome to the Zentage Ticket Booking System for the Sasnaka Sansada Talent Show 2026.
            We are committed to protecting your personal information and your right to privacy. This
            Privacy Policy explains what information we collect, how we use it, and what rights you
            have in relation to it.
          </p>
          <p>
            By registering for and purchasing tickets through this platform, you agree to the
            collection and use of information in accordance with this policy.
          </p>
        </div>

        {/* Section 2 */}
        <div className="pol-section">
          <div className="pol-section-number">Section 02</div>
          <h2 className="pol-section-title">Information We Collect</h2>
          <p>We collect the following personal information when you book a ticket:</p>
          <ul>
            <li>Full name</li>
            <li>Email address (via Google Sign-In or email/password registration)</li>
            <li>Phone number (provided during attendee details)</li>
            <li>Payment details (processed securely through PayHere - we do not store card data)</li>
            <li>Selected seat and ticket category</li>
            <li>IP address and browser/device information for security purposes</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="pol-section">
          <div className="pol-section-number">Section 03</div>
          <h2 className="pol-section-title">How We Use Your Information</h2>
          <p>The personal data we collect is used solely for the following purposes:</p>
          <ul>
            <li>To process your ticket booking and confirm your seat reservation</li>
            <li>To generate and deliver your digital ticket (QR code) via the platform</li>
            <li>To send booking confirmations and event-related communications</li>
            <li>To verify ticket authenticity at the event entrance</li>
            <li>To process payments securely through PayHere payment gateway</li>
            <li>To manage and maintain your account</li>
            <li>To comply with legal obligations</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="pol-section">
          <div className="pol-section-number">Section 04</div>
          <h2 className="pol-section-title">Payment Data &amp; Third-Party Services</h2>
          <p>
            Payments are processed by <strong style={{ color: "#c4b9d8" }}>PayHere</strong>, a
            PCI-DSS compliant payment gateway. We do not store, process, or have access to your
            full credit/debit card details. All payment transactions are encrypted and handled
            directly by PayHere.
          </p>
          <div className="pol-highlight">
            We use Google Firebase for authentication and database services. Your data is stored on
            Firebase servers and is subject to Google's Privacy Policy in addition to ours.
          </div>
          <p>
            We do not sell, trade, or otherwise transfer your personally identifiable information to
            outside parties except as necessary to operate our services (e.g., payment processors,
            authentication providers).
          </p>
        </div>

        {/* Section 5 */}
        <div className="pol-section">
          <div className="pol-section-number">Section 05</div>
          <h2 className="pol-section-title">Photography &amp; Recording Consent</h2>
          <p>
            The Sasnaka Sansada Talent Show 2026 event will be photographed and video recorded. By
            purchasing a ticket and attending the event, you consent to:
          </p>
          <ul>
            <li>Being photographed or recorded during the event</li>
            <li>Your image or likeness being used for promotional, marketing, and archival purposes</li>
            <li>Content being published on official social media channels and promotional materials</li>
          </ul>
          <p>
            If you have concerns about being photographed or recorded, please contact us prior to
            the event.
          </p>
        </div>

        {/* Section 6 */}
        <div className="pol-section">
          <div className="pol-section-number">Section 06</div>
          <h2 className="pol-section-title">Data Retention</h2>
          <p>
            We retain your personal data only for as long as necessary to fulfill the purposes
            outlined in this policy - including for the duration of the event and any post-event
            administrative or legal obligations.
          </p>
          <p>
            Booking records may be retained for up to 12 months after the event for accounting and
            legal compliance purposes. You may request deletion of your personal data by contacting
            us directly.
          </p>
        </div>

        {/* Section 7 */}
        <div className="pol-section">
          <div className="pol-section-number">Section 07</div>
          <h2 className="pol-section-title">Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data (subject to legal obligations)</li>
            <li>Withdraw consent where consent is the basis for processing</li>
            <li>Lodge a complaint with your local data protection authority</li>
          </ul>
        </div>

        {/* Section 8 */}
        <div className="pol-section">
          <div className="pol-section-number">Section 08</div>
          <h2 className="pol-section-title">Security</h2>
          <p>
            We implement industry-standard security measures to protect your personal information.
            All data transmissions are encrypted using HTTPS/TLS. Firebase Authentication is used
            to secure your account. However, no method of transmission over the Internet is 100%
            secure, and we cannot guarantee absolute security.
          </p>
        </div>

        {/* Section 9 */}
        <div className="pol-section">
          <div className="pol-section-number">Section 09</div>
          <h2 className="pol-section-title">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on
            this page with an updated revision date. We encourage you to review this page
            periodically for any changes.
          </p>
        </div>

        {/* Contact Card */}
        <div className="pol-contact-card">
          <h3>Contact Us</h3>
          <p>
            If you have any questions about this Privacy Policy or how we handle your personal data,
            please contact us:
          </p>
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
