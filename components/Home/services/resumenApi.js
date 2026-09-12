import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../api";

// Resumen del usuario para las tarjetas del home: total operaciones,
// soles cambiados y bolivianos cambiados. Requiere token (igual que transfers).
export async function fetchResumen(userId) {
  const token = await AsyncStorage.getItem("token");
  const res = await fetch(`${API_BASE_URL}/api/operaciones/resumen?user_id=${userId}`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json = await res.json();
  return {
    operaciones: json.total_operaciones ?? 0,
    soles: json.soles_cambiados ?? 0,
    bolivianos: json.bolivianos_cambiados ?? 0,
  };
}
