import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "../lib/useDocumentTitle";

/* ─── Scoped styles ──────────────────────────────────────────────────────── */
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

export default function PrivacyPolicyPage() {
  useDocumentTitle("Privacy Policy | Zentage Talent Show");

  useEffect(() => {
    const el = document.createElement("style");
    el.id = "pol-styles-privacy";
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
        <span className="pol-header-title">Privacy Policy</span>
      </header>

      {/* ── Content ── */}
      <main className="pol-container">
        <div className="pol-badge">🔒 Legal</div>
        <h1 className="pol-title">Privacy Policy</h1>
        <p className="pol-subtitle">
          Sasnaka Sansada Talent Show 2026 — Zentage Booking System
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
            <li>Payment details (processed securely through PayHere — we do not store card data)</li>
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
            outlined in this policy — including for the duration of the event and any post-event
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
          <p><strong style={{ color: "#c4b9d8" }}>Event:</strong> Sasnaka Sansada Talent Show 2026</p>
          <p><strong style={{ color: "#c4b9d8" }}>Platform:</strong> Zentage Ticket Booking System</p>
          <p><strong style={{ color: "#c4b9d8" }}>Email:</strong> <a href="mailto:sasnakasansada@gmail.com">sasnakasansada@gmail.com</a></p>
        </div>

        <div className="pol-footer">
          © 2026 Sasnaka Sansada Talent Show — Zentage Booking System. All rights reserved.
        </div>
      </main>
    </div>
  );
}
