import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../api";

export async function crearSesionKyc(nextUrl) {
  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("Sesión no disponible");

  const res = await fetch(`${API_BASE_URL}/api/kyc/session`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ next_url: nextUrl }),
  });

  const data = await res.json();
  if (!data.redirect_url) throw new Error("No se recibió redirect_url");
  return data.redirect_url;
}
