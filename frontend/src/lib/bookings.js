import api from "./api";

/**
 * Creates a new booking.
 * Note: Checkout flow has been migrated to payments.js.
 * @param {Object} payload
 * @param {string} payload.seatCode
 * @param {string} payload.district
 * @param {boolean} payload.isSasnakaMember
 * @param {string|null} payload.phone
 * @returns {Promise<Object>} The created booking details
 */
export async function createBooking({ seatCode, district, isSasnakaMember, phone }) {
  const { data } = await api.post("/bookings", {
    seat_code: seatCode,
    district,
    is_sasnaka_member: isSasnakaMember,
    phone: phone || null,
  });
  return data;
}

/**
 * Fetches all active confirmed/pending bookings associated with the current user session.
 * @returns {Promise<Array<{booking_ref: string, seat_code: string, section: string, status: string, user_id: number}>>} Array of bookings
 */
export async function fetchMyBooking() {
  const { data } = await api.get("/bookings/me");
  return data;
}
