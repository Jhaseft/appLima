import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../api";

async function authHeaders() {
  const token = await AsyncStorage.getItem("token");
  return { Authorization: `Bearer ${token}`, Accept: "application/json" };
}

export async function obtenerSaldo() {
  const res = await fetch(`${API_BASE_URL}/api/tc-puntos/saldo`, {
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error("No se pudo cargar el saldo");
  return res.json();
}

export async function obtenerCatalogo() {
  const res = await fetch(`${API_BASE_URL}/api/tc-puntos/catalogo`, {
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error("No se pudo cargar el catálogo");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function obtenerHistorial() {
  const res = await fetch(`${API_BASE_URL}/api/tc-puntos/historial`, {
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error("No se pudo cargar el historial");
  const data = await res.json();
  return data.data ?? [];
}

export async function canjearProducto(productoId) {
  const headers = await authHeaders();
  const res = await fetch(`${API_BASE_URL}/api/tc-puntos/canjear`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ producto_id: productoId }),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.message ?? "Intenta de nuevo");
    err.title = "No se pudo canjear";
    throw err;
  }
  return data;
}
