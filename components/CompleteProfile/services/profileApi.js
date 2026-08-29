import API_BASE_URL from "../../api";
import { apiFetch } from "../../services/apiFetch";

export async function completeProfile(token, body) {
  const res = await apiFetch(`${API_BASE_URL}/api/complete-profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.status !== "success") {
    throw new Error(data.message || "No se pudo completar el perfil");
  }
  return data;
}
