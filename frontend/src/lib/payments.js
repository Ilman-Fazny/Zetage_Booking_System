import api from "./api";

export async function initiatePayment({ seatCode, district, isSasnakaMember, phone }) {
  const { data } = await api.post("/payments/initiate", {
    seat_code: seatCode,
    district,
    is_sasnaka_member: isSasnakaMember,
    phone: phone || null,
  });
  return data; // PayHere form params
}
