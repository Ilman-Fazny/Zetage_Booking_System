import api from "./api";

export async function initiatePayment({ seatCodes, district, isSasnakaMember, phone }) {
  const { data } = await api.post("/payments/initiate", {
    seat_codes: seatCodes,
    district,
    is_sasnaka_member: isSasnakaMember,
    phone: phone || null,
  });
  return data;
}
