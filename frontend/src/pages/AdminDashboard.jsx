import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fetchStats, fetchBookings, fetchAdmins, promoteUser, demoteUser, resendBookingEmail, adminBookSeats, fetchUsers, deleteBooking, deleteUser, markAttendance, unmarkAttendance, fetchPendingSlips, verifySlip } from "../lib/admin";
import { DISTRICTS } from "../lib/districts";
import { listContainerVariants, listItemVariants, microSpring } from "../lib/motionVariants";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import logo from "../assets/zentage-TS.png";
import QrScannerModal from "../components/QrScannerModal";

import { StatsSkeleton, TableSkeleton } from "../components/shared/AdminSkeletons";

/* ─────────────────────────────────────────────────────────────────────────────
   Scoped styles - self-contained, no Tailwind conflicts
───────────────────────────────────────────────────────────────────────────── */




const SECTIONS = [
  "Ground Floor Center",
  "Ground Floor Right Side",
  "Balcony Left Side",
  "Balcony Right Side",
  "Balcony Front Side",
  "Upper",
];

export default function AdminDashboard() {
  useDocumentTitle("Admin Dashboard");
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [tab, setTab] = useState("overview");
  const [showScanner, setShowScanner] = useState(false);

  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterSasnaka, setFilterSasnaka] = useState("");
  const [filterSection, setFilterSection] = useState("");

  const loadStats = useCallback(async (isPolling = false) => {
    if (!isPolling) setLoadingStats(true);
    try {
      const data = await fetchStats();
      setStats(data);
    } finally {
      if (!isPolling) setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "overview") {
      loadStats();
      const interval = setInterval(() => loadStats(true), 5000);
      return () => clearInterval(interval);
    }
  }, [tab, loadStats]);

  const loadBookings = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoadingBookings(true);
    try {
      const data = await fetchBookings({
        district: filterDistrict || undefined,
        isSasnakaMember: filterSasnaka === "" ? undefined : filterSasnaka === "yes",
        section: filterSection || undefined,
      });
      setBookings(data);
    } finally {
      if (!isSilent) setLoadingBookings(false);
    }
  }, [filterDistrict, filterSasnaka, filterSection]);

  useEffect(() => {
    if (tab === "bookings") {
      loadBookings();
      const interval = setInterval(() => loadBookings(true), 5000);
      return () => clearInterval(interval);
    }
  }, [tab, loadBookings]);

  return (
    <div className="adm-root">
      {/* ── Top bar ─────────────────────────────────────── */}
      <div className="adm-topbar">
        <div className="adm-topbar-left">
          <img src={logo} alt="Zentage" className="adm-logo" />
          <div className="adm-topbar-divider" />
          <div>
            <button className="adm-back-btn" onClick={() => navigate("/")} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
              Seat Map
            </button>
            <div className="adm-topbar-title">
              <h1>Admin Panel</h1>
              <p>Zentage Talent Show · September 6, 2026</p>
            </div>
          </div>
        </div>
        <div className="adm-topbar-right">
          <motion.button
            className="adm-scan-btn"
            onClick={() => setShowScanner(true)}
            whileHover={{ scale: 1.03, y: -0.5 }}
            whileTap={{ scale: 0.97 }}
            transition={microSpring}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
            Scan Entrance
          </motion.button>
          <span className="adm-admin-badge">Admin</span>
        </div>
      </div>

      {/* ── Tab bar ─────────────────────────────────────── */}
      <div className="adm-tabs">
        {["overview", "slips", "bookings", "users", "book", "admins"].map((t) => (
          <button
            key={t}
            className={`adm-tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "overview" ? "Overview" : t === "slips" ? "Verify Slips" : t === "bookings" ? "Bookings" : t === "users" ? "Users" : t === "book" ? "Book a Seat" : "Admins"}
          </button>
        ))}
      </div>

      {/* ── Content ─────────────────────────────────────── */}
      <div className="adm-content">
        {tab === "overview" && (
          <OverviewTab stats={stats} loading={loadingStats} />
        )}
        {tab === "slips" && (
          <SlipVerificationTab />
        )}
        {tab === "bookings" && (
          <BookingsTab
            bookings={bookings}
            loading={loadingBookings}
            filterDistrict={filterDistrict}
            setFilterDistrict={setFilterDistrict}
            filterSasnaka={filterSasnaka}
            setFilterSasnaka={setFilterSasnaka}
            filterSection={filterSection}
            setFilterSection={setFilterSection}
            onApplyFilters={loadBookings}
          />
        )}
        {tab === "users" && (
          <UsersTab />
        )}
        {tab === "book" && (
          <BookSeatTab />
        )}
        {tab === "admins" && (
          <AdminsTab />
        )}
      </div>

      <AnimatePresence>
        {showScanner && (
          <QrScannerModal onClose={() => setShowScanner(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Overview tab ──────────────────────────────────────────────────────────── */
function OverviewTab({ stats, loading }) {
  if (loading) {
    return <StatsSkeleton />;
  }
  if (!stats) return null;

  const occupancy = Math.round((stats.booked_seats / stats.total_seats) * 100);
  const maxDistrict = stats.by_district
    ? Math.max(...Object.values(stats.by_district))
    : 1;
  const maxSection = stats.by_section
    ? Math.max(...Object.values(stats.by_section))
    : 1;

  return (
    <div>
      {/* ── Stat cards ── */}
      <motion.div
        className="adm-cards-grid"
        variants={listContainerVariants}
        initial="initial"
        animate="animate"
        style={{ gridTemplateColumns: "repeat(5, 1fr)" }}
      >
        <GlassCard variant="total" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>} label="Total Seats" value={stats.total_seats} sub="venue capacity" />
        <GlassCard variant="booked" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>} label="Booked" value={stats.booked_seats} sub="confirmed tickets" />
        <GlassCard variant="avail" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /></svg>} label="Available" value={stats.available_seats} sub="seats remaining" />
        <GlassCard variant="held" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>} label="Held" value={stats.held_seats} sub="in checkout" />
        <GlassCard variant="revenue" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>} label="Revenue" value={`LKR ${stats.total_revenue.toLocaleString()}`} small sub="total collected" />
      </motion.div>

      {/* ── Occupancy bar ── */}
      <div className="adm-panel" style={{ marginBottom: 16 }}>
        <p className="adm-panel-title">Occupancy Rate</p>
        <div className="adm-occ-header">
          <span className="adm-occ-label">Seat fill</span>
          <span className="adm-occ-pct">{occupancy}%</span>
        </div>
        <div className="adm-occ-track">
          <div className="adm-occ-fill" style={{ width: `${occupancy}%` }} />
        </div>
        <div className="adm-occ-ticks">
          {["0%", "25%", "50%", "75%", "100%"].map((t) => (
            <span key={t} className="adm-occ-tick">{t}</span>
          ))}
        </div>
      </div>

      {/* ── Sasnaka members ── */}
      <div className="adm-panel" style={{ marginBottom: 16 }}>
        <p className="adm-panel-title">Sasnaka Sansada Members</p>
        <div className="adm-sasnaka-row">
          <div>
            <div className="adm-sasnaka-count">{stats.sasnaka_member_count}</div>
            <div className="adm-sasnaka-of">of {stats.booked_seats} total bookings</div>
          </div>
          <span className="adm-sasnaka-badge">
            {stats.booked_seats > 0
              ? `${Math.round((stats.sasnaka_member_count / stats.booked_seats) * 100)}% members`
              : "0% members"}
          </span>
        </div>
      </div>

      {/* ── Two column panels ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Bookings by district */}
        <div className="adm-panel" style={{ marginBottom: 0 }}>
          <p className="adm-panel-title">By District</p>
          {!stats.by_district || Object.keys(stats.by_district).length === 0 ? (
            <p style={{ fontSize: 12, color: "rgba(180,170,210,0.3)" }}>No bookings yet</p>
          ) : (
            <div className="adm-bars-list">
              {Object.entries(stats.by_district)
                .sort((a, b) => b[1] - a[1])
                .map(([district, count], i) => (
                  <GlowBarRow
                    key={district}
                    label={district}
                    count={count}
                    max={maxDistrict}
                    gold={i === 0}
                  />
                ))}
            </div>
          )}
        </div>

        {/* Bookings by section */}
        <div className="adm-panel" style={{ marginBottom: 0 }}>
          <p className="adm-panel-title">By Section</p>
          {!stats.by_section || Object.keys(stats.by_section).length === 0 ? (
            <p style={{ fontSize: 12, color: "rgba(180,170,210,0.3)" }}>No bookings yet</p>
          ) : (
            <div className="adm-bars-list">
              {Object.entries(stats.by_section)
                .sort((a, b) => b[1] - a[1])
                .map(([section, count], i) => (
                  <GlowBarRow
                    key={section}
                    label={section}
                    count={count}
                    max={maxSection}
                    gold={i === 0}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GlassCard({ variant, icon, label, value, sub, small }) {
  return (
    <motion.div
      className={`adm-glass-card adm-card-${variant}`}
      variants={listItemVariants}
      whileHover={{ y: -3, scale: 1.02, transition: microSpring }}
    >
      <div className="adm-card-icon">{icon}</div>
      <p className="adm-card-label">{label}</p>
      <p className={`adm-card-value${small ? " sm" : ""}`}>{value}</p>
      {sub && <p className="adm-card-sub">{sub}</p>}
    </motion.div>
  );
}

function GlowBarRow({ label, count, max, gold }) {
  const pct = Math.round((count / max) * 100);
  return (
    <div className={`adm-bar-row${gold ? " top-district" : ""}`}>
      <span className="adm-bar-label" title={label}>{label}</span>
      <div className="adm-bar-track">
        <div className="adm-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="adm-bar-count">{count}</span>
    </div>
  );
}

/* ─── Bookings tab ──────────────────────────────────────────────────────────── */
function BookingsTab({
  bookings, loading,
  filterDistrict, setFilterDistrict,
  filterSasnaka, setFilterSasnaka,
  filterSection, setFilterSection,
  onApplyFilters,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBookings = bookings.filter((b) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      (b.booking_ref && b.booking_ref.toLowerCase().includes(query)) ||
      (b.attendee_name && b.attendee_name.toLowerCase().includes(query)) ||
      (b.user_email && b.user_email.toLowerCase().includes(query)) ||
      (b.seat_code && b.seat_code.toLowerCase().includes(query)) ||
      (b.district && b.district.toLowerCase().includes(query)) ||
      (b.section && b.section.toLowerCase().includes(query))
    );
  });

  const onResendEmail = async (bookingId, email) => {
    try {
      await resendBookingEmail(bookingId);
      alert(`Email resent successfully to ${email}!`);
      onApplyFilters(true);
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to resend email.";
      alert(`Error: ${msg}`);
    }
  };

  const onMarkAttendance = async (bookingRef) => {
    try {
      await markAttendance(bookingRef);
      onApplyFilters(true);
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to mark attendance.";
      alert(`Error: ${msg}`);
    }
  };

  const onUnmarkAttendance = async (bookingRef) => {
    try {
      await unmarkAttendance(bookingRef);
      onApplyFilters(true);
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to undo attendance.";
      alert(`Error: ${msg}`);
    }
  };

  const downloadCSV = () => {
    if (filteredBookings.length === 0) {
      alert("No data to download.");
      return;
    }
    const headers = ["Ref", "Name", "Email", "Seat", "Section", "District", "Sasnaka Member", "Status", "Email Sent", "Attendance", "Date"];
    const rows = filteredBookings.map(b => [
      b.booking_ref,
      `"${b.attendee_name || ""}"`,
      b.user_email,
      b.seat_code,
      b.section,
      b.district,
      b.is_sasnaka_member ? "Yes" : "No",
      b.status,
      b.email_sent ? "Yes" : "No",
      b.is_entered ? "Yes" : "No",
      new Date(b.created_at).toLocaleDateString("en-GB")
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "zentage_bookings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* Filter panel */}
      <div className="adm-filter-panel">
        <p className="adm-filter-title">Filters & Search</p>

        {/* Search bar input */}
        <div className="adm-input-wrapper">
          <span className="adm-input-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            className="adm-input"
            placeholder="Search by name, email, booking ref, seat, section, district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="adm-filter-grid">
          <select
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
            className="adm-select"
          >
            <option value="">All Districts</option>
            {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
          </select>
          <select
            value={filterSasnaka}
            onChange={(e) => setFilterSasnaka(e.target.value)}
            className="adm-select"
          >
            <option value="">Sasnaka - All</option>
            <option value="yes">Members Only</option>
            <option value="no">Non-members Only</option>
          </select>
          <select
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
            className="adm-select"
          >
            <option value="">All Sections</option>
            {SECTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center", marginTop: "12px" }}>
          <motion.button
            className="adm-csv-btn"
            onClick={downloadCSV}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={microSpring}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download CSV
          </motion.button>
          <motion.button
            className="adm-apply-btn"
            onClick={onApplyFilters}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={microSpring}
          >
            Apply Filters →
          </motion.button>
        </div>
      </div>

      {/* Results count */}
      <p className="adm-results-count">
        {loading
          ? "Loading…"
          : `${filteredBookings.length} booking${filteredBookings.length !== 1 ? "s" : ""} found${searchQuery ? ` matching "${searchQuery}"` : ""}`}
      </p>

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={8} columns={11} />
      ) : filteredBookings.length === 0 ? (
        <div className="adm-table-wrap">
          <p className="adm-no-results">
            {bookings.length === 0
              ? "No bookings match the current filters."
              : "No bookings match your search query."}
          </p>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <div className="adm-table-scroll">
            <table className="adm-table">
              <thead>
                <tr>
                  {["Ref", "Name", "Email", "Seat", "Section", "District", "Sasnaka", "Status", "Email Status", "Attendance", "Date"].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <motion.tbody
                variants={listContainerVariants}
                initial="initial"
                animate="animate"
              >
                {filteredBookings.map((b) => (
                  <motion.tr key={b.id} variants={listItemVariants}>
                    <td className="adm-td-ref">{b.booking_ref}</td>
                    <td>{b.attendee_name || "-"}</td>
                    <td className="adm-td-email">{b.user_email}</td>
                    <td className="adm-td-seat">{b.seat_code}</td>
                    <td style={{ fontSize: 11.5, whiteSpace: "nowrap" }}>{b.section}</td>
                    <td>{b.district}</td>
                    <td>
                      {b.is_sasnaka_member
                        ? <span className="adm-badge-member">Member</span>
                        : <span className="adm-badge-no">No</span>}
                    </td>
                    <td>
                      {b.status === "confirmed" || b.status === "CONFIRMED"
                        ? <span className="adm-badge-member" style={{ borderColor: "rgba(52,211,153,0.2)", color: "#34d399" }}>Confirmed</span>
                        : <span className="adm-badge-no" style={{ borderColor: "rgba(251,146,60,0.2)", color: "#fb923c" }}>Pending</span>}
                    </td>
                    <td>
                      <div className="adm-email-cell">
                        {b.email_sent ? (
                          <span className="adm-badge-delivered">Delivered</span>
                        ) : (
                          <span className="adm-badge-failed">Failed</span>
                        )}
                        <button
                          onClick={() => onResendEmail(b.id, b.user_email)}
                          className="adm-btn-resend"
                          title="Resend ticket email"
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                          Resend
                        </button>
                      </div>
                    </td>
                    <td>
                      {b.is_entered ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px", alignItems: "flex-start" }}>
                          <span className="adm-badge-member">Checked In</span>
                          {b.entered_at && (
                            <span style={{ fontSize: "10px", color: "rgba(52, 211, 153, 0.7)" }}>
                              {new Date(b.entered_at).toLocaleTimeString("en-LK", {
                                hour: "2-digit", minute: "2-digit",
                              })}
                            </span>
                          )}
                          <button
                            className="adm-btn-checkin"
                            style={{ background: "transparent", color: "#f43f5e", borderColor: "rgba(244, 63, 94, 0.2)" }}
                            onClick={() => onUnmarkAttendance(b.booking_ref)}
                            title="Undo check-in"
                          >
                            Undo
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                          <span className="adm-badge-no" style={{ color: "rgba(180, 170, 210, 0.45)", borderColor: "rgba(180, 170, 210, 0.15)", background: "rgba(180, 170, 210, 0.02)" }}>Pending</span>
                          <button
                            className="adm-btn-checkin"
                            onClick={() => onMarkAttendance(b.booking_ref)}
                            title="Manually check in this attendee"
                          >
                            Mark Present
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="adm-td-date">
                      {new Date(b.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Admins tab ────────────────────────────────────────────────────────────── */
function AdminsTab() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoteEmail, setPromoteEmail] = useState("");
  const [promoting, setPromoting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdmins();
      setAdmins(data);
    } catch (err) {
      console.error("Failed to fetch admins:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  const handlePromote = async (e) => {
    e.preventDefault();
    if (!promoteEmail.trim()) return;

    setPromoting(true);
    setError("");
    setSuccess("");

    try {
      const res = await promoteUser(promoteEmail);
      setSuccess(`Successfully promoted ${res.email} to Admin!`);
      setPromoteEmail("");
      // Refetch
      const updatedAdmins = await fetchAdmins();
      setAdmins(updatedAdmins);
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to promote user to Admin.";
      setError(msg);
    } finally {
      setPromoting(false);
    }
  };

  const handleDemote = async (email) => {
    const isSuperAdmin = email.toLowerCase() === "ilmanfazny123@gmail.com";
    if (isSuperAdmin) {
      alert("Cannot demote the superadmin user.");
      return;
    }

    if (!window.confirm(`Are you sure you want to dismiss ${email} from the administrator role?`)) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await demoteUser(email);
      setSuccess(`Successfully dismissed ${email} from Admin role.`);
      // Refetch
      const updatedAdmins = await fetchAdmins();
      setAdmins(updatedAdmins);
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to dismiss administrator.";
      setError(msg);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Promote Form */}
        <div className="adm-panel">
          <p className="adm-panel-title">Promote User to Admin</p>
          <form onSubmit={handlePromote} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
              <div className="adm-input-wrapper" style={{ flexGrow: 1, marginBottom: 0 }}>
                <span className="adm-input-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  type="email"
                  className="adm-input"
                  placeholder="Enter user email address..."
                  value={promoteEmail}
                  onChange={(e) => setPromoteEmail(e.target.value)}
                  disabled={promoting}
                  required
                />
              </div>
              <motion.button
                type="submit"
                className="adm-apply-btn"
                style={{ marginTop: 0, padding: "10px 24px" }}
                disabled={promoting}
                whileHover={{ scale: 1.02, y: -0.5 }}
                whileTap={{ scale: 0.98 }}
                transition={microSpring}
              >
                {promoting ? "Promoting..." : "Promote Admin"}
              </motion.button>
            </div>
            {error && (
              <p style={{ color: "#ef4444", fontSize: "13px", fontWeight: "500", margin: "4px 0 0" }}>
                {error}
              </p>
            )}
            {success && (
              <p style={{ color: "#34d399", fontSize: "13px", fontWeight: "500", margin: "4px 0 0" }}>
                {success}
              </p>
            )}
          </form>
        </div>

        {/* Admins List */}
        <div className="adm-panel">
          <p className="adm-panel-title">Current Admins List</p>
          {loading ? (
            <TableSkeleton rows={4} columns={5} />
          ) : admins.length === 0 ? (
            <p style={{ fontSize: "13px", color: "rgba(180,170,210,0.35)", textAlign: "center", padding: "20px 0" }}>
              No admins found.
            </p>
          ) : (
            <div className="adm-table-wrap">
              <div className="adm-table-scroll">
                <table className="adm-table">
                  <thead>
                    <tr>
                      {["ID", "Name", "Email", "Role", "Actions"].map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <motion.tbody
                    variants={listContainerVariants}
                    initial="initial"
                    animate="animate"
                  >
                    {admins.map((admin) => {
                      const isSuperAdmin = admin.email.toLowerCase() === "ilmanfazny123@gmail.com";
                      return (
                        <motion.tr key={admin.id} variants={listItemVariants}>
                          <td className="adm-td-ref">#{admin.id}</td>
                          <td>{admin.name || "-"}</td>
                          <td className="adm-td-email">{admin.email}</td>
                          <td>
                            {isSuperAdmin ? (
                              <span className="adm-admin-badge" style={{ fontSize: "9.5px", padding: "2px 8px", color: "#fbbf24", borderColor: "rgba(251, 191, 36, 0.35)", background: "rgba(251, 191, 36, 0.08)" }}>
                                Super Admin
                              </span>
                            ) : (
                              <span className="adm-admin-badge" style={{ fontSize: "9.5px", padding: "2px 8px" }}>
                                Admin
                              </span>
                            )}
                          </td>
                          <td>
                            {!isSuperAdmin ? (
                              <motion.button
                                onClick={() => handleDemote(admin.email)}
                                className="adm-scan-btn"
                                style={{
                                  background: "rgba(239, 68, 68, 0.08)",
                                  border: "1px solid rgba(239, 68, 68, 0.25)",
                                  color: "#ef4444",
                                  padding: "4px 10px",
                                  fontSize: "11.5px",
                                  boxShadow: "none",
                                  borderRadius: "6px",
                                  display: "inline-flex"
                                }}
                                whileHover={{ scale: 1.03, background: "rgba(239, 68, 68, 0.15)" }}
                                whileTap={{ scale: 0.97 }}
                                transition={microSpring}
                              >
                                Dismiss
                              </motion.button>
                            ) : (
                              <span style={{ fontSize: "11.5px", color: "rgba(180, 170, 210, 0.35)", fontWeight: "500", letterSpacing: "0.02em" }}>Permanent</span>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </motion.tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Book Seat tab ────────────────────────────────────────────────────────────── */
function BookSeatTab() {
  const [email, setEmail] = useState("");
  const [seatCodes, setSeatCodes] = useState("");
  const [district, setDistrict] = useState("");
  const [isSasnaka, setIsSasnaka] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleBook = async (e) => {
    e.preventDefault();
    if (!email.trim() || !seatCodes.trim() || !district) return;

    setSubmitting(true);
    setError("");
    setSuccess("");

    const seats = seatCodes.split(",").map(s => s.trim()).filter(Boolean);

    try {
      const res = await adminBookSeats({
        seat_codes: seats,
        user_email: email,
        district: district,
        is_sasnaka_member: isSasnaka === "yes",
      });
      setSuccess(res.detail || "Seats successfully booked!");
      setEmail("");
      setSeatCodes("");
      setDistrict("");
      setIsSasnaka("");
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to book seats.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="adm-panel" style={{ maxWidth: 600, margin: "0 auto" }}>
        <p className="adm-panel-title">Admin Direct Booking</p>
        <form onSubmit={handleBook} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          <div className="adm-input-wrapper" style={{ marginBottom: 0 }}>
            <span className="adm-input-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </span>
            <input
              type="email"
              className="adm-input"
              placeholder="User Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          <div className="adm-input-wrapper" style={{ marginBottom: 0 }}>
            <span className="adm-input-icon"><svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" /></svg></span>
            <input
              type="text"
              className="adm-input"
              placeholder="Seat Codes (comma-separated, e.g. UH22b-29, UH22b-30)"
              value={seatCodes}
              onChange={(e) => setSeatCodes(e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          <select
            className="adm-select"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            disabled={submitting}
            required
          >
            <option value="" disabled>Select District</option>
            {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
          </select>

          <select
            className="adm-select"
            value={isSasnaka}
            onChange={(e) => setIsSasnaka(e.target.value)}
            disabled={submitting}
            required
          >
            <option value="" disabled>Sasnaka Member?</option>
            <option value="yes">Yes, I am a member</option>
            <option value="no">No, I am not</option>
          </select>

          <motion.button
            type="submit"
            className="adm-apply-btn"
            disabled={submitting}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={microSpring}
          >
            {submitting ? "Booking..." : <>Confirm Free Booking <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" /></svg></>}
          </motion.button>

          {error && (
            <p style={{ color: "#ef4444", fontSize: "13px", fontWeight: "500", marginTop: "8px" }}>
              ❌ {error}
            </p>
          )}
          {success && (
            <p style={{ color: "#34d399", fontSize: "13px", fontWeight: "500", marginTop: "8px" }}>
              ✅ {success}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

/* ─── Users tab ────────────────────────────────────────────────────────────── */
function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterHasBooking, setFilterHasBooking] = useState("");
  const [filterSection, setFilterSection] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const loadUsers = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const data = await fetchUsers({
        hasBooking: filterHasBooking === "" ? undefined : filterHasBooking === "yes",
        section: filterSection || undefined,
      });
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, [filterHasBooking, filterSection]);

  useEffect(() => {
    loadUsers();
    const interval = setInterval(() => loadUsers(true), 5000);
    return () => clearInterval(interval);
  }, [loadUsers]);

  // Search input debouncer (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Client-side search filtering by name/email
  const filteredUsers = users.filter((u) => {
    const query = debouncedSearch.trim().toLowerCase();
    if (!query) return true;
    return (
      (u.name && u.name.toLowerCase().includes(query)) ||
      (u.email && u.email.toLowerCase().includes(query))
    );
  });

  const handleCancelBooking = async (bookingRef) => {
    if (!window.confirm(`Are you sure you want to cancel booking ${bookingRef}? This will release the seat.`)) {
      return;
    }
    try {
      await deleteBooking(bookingRef);
      alert(`Booking ${bookingRef} cancelled successfully!`);
      loadUsers();
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to cancel booking.";
      alert(`Error: ${msg}`);
    }
  };

  const handleDeleteUser = async (userId, email) => {
    if (email.toLowerCase() === "ilmanfazny123@gmail.com") {
      alert("Cannot delete the superadmin user.");
      return;
    }
    if (!window.confirm(`WARNING: Are you sure you want to delete user ${email}? This will permanently remove their account and release all of their booked seats.`)) {
      return;
    }
    try {
      await deleteUser(userId);
      alert(`User ${email} deleted successfully!`);
      loadUsers();
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to delete user.";
      alert(`Error: ${msg}`);
    }
  };

  return (
    <div>
      {/* Filter panel */}
      <div className="adm-filter-panel">
        <p className="adm-filter-title">👥 User Filters & Search</p>

        {/* Search bar input */}
        <div className="adm-input-wrapper">
          <span className="adm-input-icon">🔍</span>
          <input
            type="text"
            className="adm-input"
            placeholder="Search by user name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="adm-filter-grid">
          <select
            value={filterHasBooking}
            onChange={(e) => setFilterHasBooking(e.target.value)}
            className="adm-select"
          >
            <option value="">All Users</option>
            <option value="yes">Has booking</option>
            <option value="no">No booking</option>
          </select>

          <select
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
            className="adm-select"
          >
            <option value="">All Sections</option>
            {SECTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="adm-results-count">
        {loading
          ? "Loading…"
          : `${filteredUsers.length} user${filteredUsers.length !== 1 ? "s" : ""} found${debouncedSearch ? ` matching "${debouncedSearch}"` : ""}`}
      </p>

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={8} columns={6} />
      ) : filteredUsers.length === 0 ? (
        <div className="adm-table-wrap">
          <p className="adm-no-results">
            {users.length === 0
              ? "No users match the current filters."
              : "No users match your search query."}
          </p>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <div className="adm-table-scroll">
            <table className="adm-table">
              <thead>
                <tr>
                  {["Name", "Email", "Seats Booked", "Booking Refs", "Joined Date", "Actions"].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <motion.tbody
                variants={listContainerVariants}
                initial="initial"
                animate="animate"
              >
                {filteredUsers.map((user) => (
                  <motion.tr key={user.id} variants={listItemVariants}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontWeight: 600 }}>{user.name || "-"}</span>
                        {user.is_admin && (
                          <span className="adm-admin-badge" style={{ fontSize: "9px", padding: "2.5px 6px" }}>
                            Admin
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="adm-td-email">{user.email}</td>
                    <td>
                      {user.booking_count > 0 ? (
                        <span className="adm-badge-member" style={{ fontSize: "11px", padding: "2.5px 8px" }}>
                          {user.booking_count}
                        </span>
                      ) : (
                        <span className="adm-badge-no" style={{ fontSize: "11px", padding: "2.5px 8px", color: "rgba(180, 170, 210, 0.5)", borderColor: "rgba(180, 170, 210, 0.2)", background: "rgba(180, 170, 210, 0.04)" }}>
                          0
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                        {user.bookings && user.bookings.length > 0 ? (
                          user.bookings.map((b) => (
                            <div
                              key={b.booking_ref}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                background: "rgba(255, 255, 255, 0.03)",
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                borderRadius: "6px",
                                padding: "3px 8px",
                              }}
                            >
                              <span className="adm-td-ref" style={{ fontSize: "11px" }}>
                                {b.booking_ref} ({b.seat_code})
                              </span>
                              <motion.button
                                onClick={() => handleCancelBooking(b.booking_ref)}
                                style={{
                                  background: "rgba(239, 68, 68, 0.08)",
                                  border: "1px solid rgba(239, 68, 68, 0.25)",
                                  color: "#ef4444",
                                  cursor: "pointer",
                                  fontSize: "10px",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  fontWeight: "500",
                                  display: "inline-flex",
                                  alignItems: "center"
                                }}
                                whileHover={{ scale: 1.05, background: "rgba(239, 68, 68, 0.15)" }}
                                whileTap={{ scale: 0.95 }}
                                transition={microSpring}
                                title={`Cancel booking ${b.booking_ref}`}
                              >
                                Cancel
                              </motion.button>
                            </div>
                          ))
                        ) : (
                          <span style={{ color: "rgba(180, 170, 210, 0.3)" }}>-</span>
                        )}
                      </div>
                    </td>
                    <td className="adm-td-date">
                      {new Date(user.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>
                    <td>
                      {user.email.toLowerCase() !== "ilmanfazny123@gmail.com" ? (
                        <motion.button
                          onClick={() => handleDeleteUser(user.id, user.email)}
                          className="adm-scan-btn"
                          style={{
                            background: "rgba(239, 68, 68, 0.08)",
                            border: "1px solid rgba(239, 68, 68, 0.25)",
                            color: "#ef4444",
                            padding: "4px 10px",
                            fontSize: "11.5px",
                            boxShadow: "none",
                            borderRadius: "6px",
                            display: "inline-flex"
                          }}
                          whileHover={{ scale: 1.03, background: "rgba(239, 68, 68, 0.15)" }}
                          whileTap={{ scale: 0.97 }}
                          transition={microSpring}
                          title={`Delete user ${user.email}`}
                        >
                          Delete 🗑
                        </motion.button>
                      ) : (
                        <span style={{ fontSize: "11.5px", color: "rgba(180, 170, 210, 0.35)", fontWeight: "500" }}>🔒 Permanent</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Slip Verification Tab ─────────────────────────────────────────────────── */
function SlipVerificationTab() {
  const [slips, setSlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlip, setSelectedSlip] = useState(null);
  
  const loadSlips = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPendingSlips();
      setSlips(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSlips();
    const interval = setInterval(loadSlips, 10000);
    return () => clearInterval(interval);
  }, [loadSlips]);

  const handleVerify = async (bookingRef, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this slip?`)) return;
    
    try {
      await verifySlip(bookingRef, action);
      alert(`Slip ${action}d successfully`);
      setSelectedSlip(null);
      loadSlips();
    } catch (err) {
      alert("Error: " + (err.response?.data?.detail || err.message));
    }
  };

  if (loading && slips.length === 0) return <StatsSkeleton />;

  return (
    <div>
      <div className="adm-panel">
        <p className="adm-panel-title">Pending Slip Verifications</p>
        {slips.length === 0 ? (
          <p style={{ fontSize: "13px", color: "rgba(180,170,210,0.35)", textAlign: "center", padding: "20px 0" }}>
            No slips pending verification.
          </p>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Seat</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {slips.map((b) => (
                  <tr key={b.id}>
                    <td>{b.booking_ref}</td>
                    <td>{b.attendee_name}</td>
                    <td>{b.user_email}</td>
                    <td>{b.seat_code}</td>
                    <td>
                      <button 
                        className="adm-apply-btn" 
                        style={{ padding: "6px 12px", fontSize: 12 }}
                        onClick={() => setSelectedSlip(b)}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedSlip && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)"
          }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{
                background: "#1e1b4b", padding: 24, borderRadius: 16, maxWidth: 600, width: "100%",
                maxHeight: "90vh", overflowY: "auto", border: "1px solid rgba(139,92,246,0.3)"
              }}
            >
              <h2 style={{ color: "#fff", marginTop: 0 }}>Review Slip: {selectedSlip.booking_ref}</h2>
              <div style={{ marginBottom: 16 }}>
                <p style={{ margin: "4px 0", color: "#e2d9ff" }}><strong>Name:</strong> {selectedSlip.attendee_name}</p>
                <p style={{ margin: "4px 0", color: "#e2d9ff" }}><strong>Email:</strong> {selectedSlip.user_email}</p>
                <p style={{ margin: "4px 0", color: "#e2d9ff" }}><strong>Seat:</strong> {selectedSlip.seat_code} ({selectedSlip.section})</p>
              </div>
              
              <div style={{ background: "#000", borderRadius: 8, padding: 8, marginBottom: 20 }}>
                {selectedSlip.slip_url ? (
                  <img 
                    src={import.meta.env.VITE_API_URL.replace('/api', '') + selectedSlip.slip_url} 
                    alt="Slip" 
                    style={{ width: "100%", maxHeight: "50vh", objectFit: "contain" }} 
                    onError={(e) => { e.target.src = ""; e.target.alt = "Image not found"; }}
                  />
                ) : (
                  <p style={{ color: "red", textAlign: "center" }}>No image attached</p>
                )}
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button 
                  onClick={() => setSelectedSlip(null)}
                  className="adm-back-btn"
                  style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", padding: "8px 16px", color: "#fff", borderRadius: 8, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleVerify(selectedSlip.booking_ref, "reject")}
                  style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.5)", padding: "8px 16px", color: "#fca5a5", borderRadius: 8, cursor: "pointer" }}
                >
                  Reject
                </button>
                <button 
                  onClick={() => handleVerify(selectedSlip.booking_ref, "approve")}
                  className="adm-apply-btn"
                  style={{ padding: "8px 16px" }}
                >
                  Approve
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
