import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../api";

async function authHeaders() {
  const token = await AsyncStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// type: "bank" | "qr"
export async function listarCuentas(userId, type) {
  const res = await fetch(
    `${API_BASE_URL}/api/listar-cuentas?user_id=${userId}&type=${type}`,
    { headers: await authHeaders() }
  );

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Respuesta inválida del backend");
  }
  if (!res.ok) throw new Error("Error al cargar cuentas");
  return Array.isArray(data) ? data : [];
}

export async function eliminarCuenta(id) {
  const res = await fetch(`${API_BASE_URL}/api/eliminar/${id}`, {
    method: "DELETE",
    headers: await authHeaders(),
  });

  const text = await res.text();
  let data = {};
  try {
    data = JSON.parse(text);
  } catch {}
  if (!res.ok) throw new Error(data.message || "Error al eliminar la cuenta");
  return data;
}
