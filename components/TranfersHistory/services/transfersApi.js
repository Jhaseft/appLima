import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../api";

export async function obtenerTransfers(userId, page, perPage, search) {
  const token = await AsyncStorage.getItem("token");
  const params = new URLSearchParams({ user_id: userId, page, per_page: perPage });
  if (search?.trim()) params.set("search", search.trim());

  const res = await fetch(`${API_BASE_URL}/api/transfers/historymobile?${params}`, {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
