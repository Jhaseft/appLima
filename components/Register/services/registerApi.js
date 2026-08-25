import API_BASE_URL from "../../api";

export async function registerUser(form) {
  const res = await fetch(`${API_BASE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(form),
  });
  const data = await res.json();
  if (!res.ok || data.status !== "success") {
    throw new Error(data.message || "No se pudo completar el registro");
  }
  return data;
}
