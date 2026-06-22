import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStats, fetchBookings } from "../lib/admin";
import { DISTRICTS } from "../lib/districts";

const SECTIONS = [
  "Ground Floor Center",
  "Ground Floor Right Side",
  "Balcony Left Side",
  "Balcony Right Side",
  "Balcony Front Side",
  "Upper",
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [tab, setTab] = useState("overview"); // "overview" | "bookings"
  const navigate = useNavigate();

  // Filters
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterSasnaka, setFilterSasnaka] = useState("");
  const [filterSection, setFilterSection] = useState("");

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .finally(() => setLoadingStats(false));
  }, []);

  const loadBookings = useCallback(async () => {
    setLoadingBookings(true);
    try {
      const data = await fetchBookings({
        district: filterDistrict || undefined,
        isSasnakaMember:
          filterSasnaka === "" ? undefined : filterSasnaka === "yes",
        section: filterSection || undefined,
      });
      setBookings(data);
    } finally {
      setLoadingBookings(false);
    }
  }, [filterDistrict, filterSasnaka, filterSection]);

  useEffect(() => {
    if (tab === "bookings") loadBookings();
  }, [tab, loadBookings]);

  return (
    <div className="min-h-screen bg-neutral-50 text-left">
      {/* Top bar */}
      <div className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
        <div>
          <button 
            onClick={() => navigate("/")}
            className="text-xs text-neutral-500 hover:text-neutral-700 font-medium mb-1 flex items-center gap-1 transition"
          >
            ← Back to Seat Selection
          </button>
          <h1 className="text-base font-semibold text-neutral-900">Admin panel</h1>
          <p className="text-xs text-neutral-500">Zentage Talent Show · September 6, 2026</p>
        </div>
        <span className="text-xs bg-neutral-900 text-white px-2.5 py-1 rounded-full font-medium">
          Admin
        </span>
      </div>

      {/* Tabs */}
      <div className="px-6 pt-4 flex gap-2 border-b border-neutral-200 bg-white">
        {["overview", "bookings"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition capitalize ${
              tab === t
                ? "border-neutral-900 text-neutral-900"
                : "border-transparent text-neutral-500"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="px-6 py-6 max-w-5xl mx-auto">
        {tab === "overview" && (
          <OverviewTab stats={stats} loading={loadingStats} />
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
      </div>
    </div>
  );
}

// ── Overview tab ─────────────────────────────────────────────────────────────

function OverviewTab({ stats, loading }) {
  if (loading) return <p className="text-sm text-neutral-500">Loading stats...</p>;
  if (!stats) return null;

  const occupancy = Math.round((stats.booked_seats / stats.total_seats) * 100);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total seats" value={stats.total_seats} />
        <StatCard label="Booked" value={stats.booked_seats} highlight />
        <StatCard label="Available" value={stats.available_seats} />
        <StatCard label="Revenue" value={`LKR ${stats.total_revenue.toLocaleString()}`} />
      </div>

      {/* Occupancy bar */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-neutral-700">Occupancy</span>
          <span className="text-neutral-500">{occupancy}%</span>
        </div>
        <div className="w-full bg-neutral-100 rounded-full h-2">
          <div
            className="bg-neutral-900 h-2 rounded-full transition-all"
            style={{ width: `${occupancy}%` }}
          />
        </div>
      </div>

      {/* Sasnaka membership */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4">
        <p className="text-sm font-medium text-neutral-700 mb-3">Sasnaka Sansada members</p>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-semibold text-neutral-900">
            {stats.sasnaka_member_count}
          </span>
          <span className="text-sm text-neutral-500">
            of {stats.booked_seats} bookings
          </span>
        </div>
      </div>

      {/* By district */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4">
        <p className="text-sm font-medium text-neutral-700 mb-3">Bookings by district</p>
        {Object.keys(stats.by_district).length === 0 ? (
          <p className="text-sm text-neutral-400">No bookings yet</p>
        ) : (
          <div className="space-y-2">
            {Object.entries(stats.by_district)
              .sort((a, b) => b[1] - a[1])
              .map(([district, count]) => (
                <BarRow
                  key={district}
                  label={district}
                  count={count}
                  max={Math.max(...Object.values(stats.by_district))}
                />
              ))}
          </div>
        )}
      </div>

      {/* By section */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4">
        <p className="text-sm font-medium text-neutral-700 mb-3">Bookings by section</p>
        {Object.keys(stats.by_section).length === 0 ? (
          <p className="text-sm text-neutral-400">No bookings yet</p>
        ) : (
          <div className="space-y-2">
            {Object.entries(stats.by_section)
              .sort((a, b) => b[1] - a[1])
              .map(([section, count]) => (
                <BarRow
                  key={section}
                  label={section}
                  count={count}
                  max={Math.max(...Object.values(stats.by_section))}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, highlight = false }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? "bg-neutral-900 border-neutral-900" : "bg-white border-neutral-200"}`}>
      <p className={`text-xs mb-1 ${highlight ? "text-neutral-400" : "text-neutral-500"}`}>{label}</p>
      <p className={`text-xl font-semibold ${highlight ? "text-white" : "text-neutral-900"}`}>{value}</p>
    </div>
  );
}

function BarRow({ label, count, max }) {
  const pct = Math.round((count / max) * 100);
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-32 text-neutral-600 truncate text-xs">{label}</span>
      <div className="flex-1 bg-neutral-100 rounded-full h-1.5">
        <div className="bg-neutral-900 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-6 text-right text-xs text-neutral-500">{count}</span>
    </div>
  );
}

// ── Bookings tab ─────────────────────────────────────────────────────────────

function BookingsTab({
  bookings, loading,
  filterDistrict, setFilterDistrict,
  filterSasnaka, setFilterSasnaka,
  filterSection, setFilterSection,
  onApplyFilters,
}) {
  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4">
        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-3">Filters</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <select
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
            className="text-sm border border-neutral-300 rounded-lg px-3 py-2 bg-white focus:outline-none"
          >
            <option value="">All districts</option>
            {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
          </select>

          <select
            value={filterSasnaka}
            onChange={(e) => setFilterSasnaka(e.target.value)}
            className="text-sm border border-neutral-300 rounded-lg px-3 py-2 bg-white focus:outline-none"
          >
            <option value="">Sasnaka — all</option>
            <option value="yes">Members only</option>
            <option value="no">Non-members only</option>
          </select>

          <select
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
            className="text-sm border border-neutral-300 rounded-lg px-3 py-2 bg-white focus:outline-none"
          >
            <option value="">All sections</option>
            {SECTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <button
          onClick={onApplyFilters}
          className="mt-3 text-sm font-medium bg-neutral-900 text-white px-4 py-2 rounded-lg hover:bg-neutral-800 transition"
        >
          Apply filters
        </button>
      </div>

      {/* Results count */}
      <p className="text-xs text-neutral-500">
        {loading ? "Loading..." : `${bookings.length} booking${bookings.length !== 1 ? "s" : ""}`}
      </p>

      {/* Table */}
      {!loading && bookings.length === 0 ? (
        <p className="text-sm text-neutral-400 py-4">No bookings match the current filters.</p>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  {["Ref", "Name", "Email", "Seat", "Section", "District", "Sasnaka", "Date"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr
                    key={b.id}
                    className={`border-b border-neutral-100 last:border-0 ${i % 2 === 0 ? "" : "bg-neutral-50/50"}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs font-medium text-neutral-900">{b.booking_ref}</td>
                    <td className="px-4 py-3 text-neutral-700">{b.user_name || "—"}</td>
                    <td className="px-4 py-3 text-neutral-500 text-xs">{b.user_email}</td>
                    <td className="px-4 py-3 font-medium text-neutral-900">{b.seat_code}</td>
                    <td className="px-4 py-3 text-neutral-500 text-xs whitespace-nowrap">{b.section}</td>
                    <td className="px-4 py-3 text-neutral-700">{b.district}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        b.is_sasnaka_member
                          ? "bg-green-100 text-green-700"
                          : "bg-neutral-100 text-neutral-500"
                      }`}>
                        {b.is_sasnaka_member ? "Member" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-400 text-xs whitespace-nowrap">
                      {new Date(b.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
