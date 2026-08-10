import api from "./api";

export async function fetchStats() {
  const { data } = await api.get("/admin/stats");
  return data;
}

export async function fetchBookings({ district, isSasnakaMember, section } = {}) {
  const params = new URLSearchParams();
  if (district) params.set("district", district);
  if (isSasnakaMember !== null && isSasnakaMember !== undefined)
    params.set("is_sasnaka_member", isSasnakaMember);
  if (section) params.set("section", section);
  const { data } = await api.get(`/admin/bookings?${params.toString()}`);
  return data;
}

export async function fetchSeatOverview() {
  const { data } = await api.get("/admin/seats");
  return data;
}

export async function fetchAdmins() {
  const { data } = await api.get("/admin/admins");
  return data;
}

export async function promoteUser(email) {
  const { data } = await api.post("/admin/promote", { email });
  return data;
}

export async function demoteUser(email) {
  const { data } = await api.post("/admin/demote", { email });
  return data;
}

export async function resendBookingEmail(bookingId) {
  const { data } = await api.post(`/admin/bookings/${bookingId}/resend-email`);
  return data;
}

export async function adminBookSeats(payload) {
  const { data } = await api.post("/admin/book", payload);
  return data;
}

export async function fetchUsers({ search, hasBooking, section } = {}) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (hasBooking !== null && hasBooking !== undefined)
    params.set("has_booking", hasBooking);
  if (section) params.set("section", section);
  const { data } = await api.get(`/admin/users?${params.toString()}`);
  return data;
}

export async function deleteBooking(bookingRef) {
  const { data } = await api.delete(`/admin/bookings/${bookingRef}`);
  return data;
}

export async function deleteUser(userId) {
  const { data } = await api.delete(`/admin/users/${userId}`);
  return data;
}

export async function markAttendance(bookingRef) {
  const { data } = await api.post("/admin/scan", { booking_ref: bookingRef });
  return data;
}

export async function unmarkAttendance(bookingRef) {
  const { data } = await api.post("/admin/unscan", { booking_ref: bookingRef });
  return data;
}

export async function fetchPendingSlips() {
  const { data } = await api.get("/admin/pending-slips");
  return data;
}

export async function verifySlip(bookingRef, action) {
  const { data } = await api.post(`/admin/bookings/${bookingRef}/verify`, { action });
  return data;
}
