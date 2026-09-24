import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../api";

async function authHeaders(json = true) {
  const token = await AsyncStorage.getItem("token");
  return {
    ...(json ? { "Content-Type": "application/json" } : {}),
    Authorization: `Bearer ${token}`,
  };
}

export async function listarBancos() {
  const res = await fetch(`${API_BASE_URL}/operacion/listar-bancos`);
  if (!res.ok) throw new Error("No se pudieron cargar los bancos");
  return res.json();
}

// body: objeto JSON o FormData (para QR con imagen).
export async function guardarCuenta(body) {
  const isForm = body instanceof FormData;
  const res = await fetch(`${API_BASE_URL}/api/operacion/guardar-cuenta`, {
    method: "POST",
    headers: await authHeaders(!isForm),
    body: isForm ? body : JSON.stringify(body),
  });

  const text = await res.text();
  let data = {};
  try {
    data = JSON.parse(text);
  } catch {}
  if (!res.ok) throw new Error(data.message || "Error al guardar la cuenta");
  return data;
}

export async function listarCuentasConBanco(userId, bancos) {
  const res = await fetch(`${API_BASE_URL}/api/listar-cuentas?user_id=${userId}&type=bank`, {
    headers: await authHeaders(),
  });
  const data = await res.json();
  if (!res.ok || !Array.isArray(data)) throw new Error("No se pudo obtener la lista de cuentas");
  return data.map((c) => ({ ...c, bank: bancos?.find((b) => b.id === c.bank_id) || null }));
}
