import api from "./api";

export async function createBooking({ seatCode, district, isSasnakaMember, phone }) {
  const { data } = await api.post("/bookings", {
    seat_code: seatCode,
    district,
    is_sasnaka_member: isSasnakaMember,
    phone: phone || null,
  });
  return data; // BookingOut: { id, booking_ref, seat_code, section, attendee_name, district, is_sasnaka_member, status }
}
