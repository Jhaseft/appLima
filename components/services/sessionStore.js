import AsyncStorage from "@react-native-async-storage/async-storage";

// Estado de "sesion expirada" (401), fuera de React para poder dispararse desde el
// interceptor de fetch. La UI (AuthGuard) se suscribe y redirige a la raiz. Solo
// aplica si HABIA un token: un 401 sin token (ej. login con credenciales malas) no
// debe forzar redireccion.
let expired = false;
const listeners = new Set();

const emit = () => listeners.forEach((l) => l());

// Devuelve true si realmente habia una sesion que expirar (para que el interceptor
// decida si corta la peticion). Idempotente mientras dure el ciclo de expiracion.
export const expireSession = async () => {
  if (expired) return true;
  const token = await AsyncStorage.getItem("token");
  if (!token) return false;

  expired = true;
  await AsyncStorage.multiRemove(["token", "user"]);
  emit();
  return true;
};

export const resetSession = () => {
  expired = false;
};

// Si la sesión ya expiró antes de que este listener se suscribiera (carrera de
// arranque: el 401 de fetchUser llega antes de montar AuthGuard), se le avisa de
// una para que no se pierda la redirección.
export const subscribe = (listener) => {
  listeners.add(listener);
  if (expired) listener();
  return () => listeners.delete(listener);
};
