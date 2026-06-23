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
