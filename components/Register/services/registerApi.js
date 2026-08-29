import API_BASE_URL from "../../api";
import { apiFetch } from "../../services/apiFetch";

async function postJson(path, body) {
  const res = await apiFetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || (data.status && data.status !== "success")) {
    throw new Error(data.message || "Ocurrió un error. Inténtalo de nuevo.");
  }
  return data;
}

export const sendRegister = (email, password) =>
  postJson("/api/register", { email, password, password_confirmation: password });

export const verifyCode = (email, code) => postJson("/api/verify-code", { email, code });
