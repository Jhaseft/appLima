import API_BASE_URL from "../api";
import { apiFetch } from "./apiFetch";

async function postJson(path, body) {
  const res = await apiFetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.headers.get("content-type")?.includes("application/json")) {
    throw new Error("El servidor devolvió HTML en lugar de JSON");
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "No se pudo iniciar sesión");
  return data;
}

export const loginWithEmail = (email, password) =>
  postJson("/api/loginapp", { email, password });

export const loginWithGoogle = (idToken) =>
  postJson("/api/logingoogle", { idToken });

export const loginWithApple = (payload) => postJson("/api/loginapple", payload);
