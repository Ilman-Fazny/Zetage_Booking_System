import api from "./api";

export async function createBooking({ seatCode, district, isSasnakaMember, phone }) {
  const { data } = await api.post("/bookings", {
    seat_code: seatCode,
    district,
    is_sasnaka_member: isSasnakaMember,
    phone: phone || null,
  });
  return data;
}

export async function fetchMyBooking() {
  const { data } = await api.get("/bookings/me");
  return data;
}
