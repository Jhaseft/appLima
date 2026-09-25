import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../api";

async function authHeaders(extra = {}) {
  const token = await AsyncStorage.getItem("token");
  return { Authorization: `Bearer ${token}`, Accept: "application/json", ...extra };
}

export async function obtenerHistorialTasas() {
  const res = await fetch(`${API_BASE_URL}/api/tipo-cambio/historial`);
  if (!res.ok) throw new Error("No se pudo obtener el historial de tasas");
  const json = await res.json();
  return Array.isArray(json) ? json : [];
}

export async function obtenerConfigTransfer() {
  const res = await fetch(`${API_BASE_URL}/api/config/transfer`);
  if (!res.ok) throw new Error("No se pudo cargar la configuración");
  return res.json();
}

export async function obtenerMetodos() {
  const res = await fetch(`${API_BASE_URL}/api/transfer-methods`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function crearSesionKyc(nextUrl) {
  const res = await fetch(`${API_BASE_URL}/api/kyc/session`, {
    method: "POST",
    headers: await authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ next_url: nextUrl }),
  });
  const data = await res.json();
  if (!data.redirect_url) throw new Error("No se recibió redirect_url");
  return data.redirect_url;
}

export async function crearTransferencia(formData) {
  const res = await fetch(`${API_BASE_URL}/api/operacion/crear-transferencia`, {
    method: "POST",
    headers: await authHeaders(),
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error al crear la transferencia");
  return data;
}
