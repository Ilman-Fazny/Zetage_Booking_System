import api from "./api";

export async function loginWithPassword(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  return data; // { access_token, token_type, user }
}

export async function registerWithPassword(email, password, name) {
  const { data } = await api.post("/auth/register", { email, password, name });
  return data;
}

export async function loginWithGoogle(credential) {
  const { data } = await api.post("/auth/google", { credential });
  return data; // { access_token, token_type, user }
}
