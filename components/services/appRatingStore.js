import AsyncStorage from "@react-native-async-storage/async-storage";

// Reglas para invitar a calificar la app sin ser molestos:
// - Nunca se vuelve a pedir si el usuario ya calificó (K_DONE).
// - Solo se invita tras completar al menos OPS_UMBRAL operaciones.
// - Si el usuario dice "ahora no", se espera DIAS_ESPERA antes de volver a pedir.
const K_DONE = "rating:done";
const K_COUNT = "rating:opsCount";
const K_LAST = "rating:lastPrompt";

const OPS_UMBRAL = 2;
const DIAS_ESPERA = 15;
const DIA_MS = 24 * 60 * 60 * 1000;

export async function registrarOperacionExitosa() {
  if (await AsyncStorage.getItem(K_DONE)) return;
  const count = parseInt((await AsyncStorage.getItem(K_COUNT)) || "0", 10) + 1;
  await AsyncStorage.setItem(K_COUNT, String(count));
}

export async function debePedirCalificacion() {
  if (await AsyncStorage.getItem(K_DONE)) return false;
  const count = parseInt((await AsyncStorage.getItem(K_COUNT)) || "0", 10);
  if (count < OPS_UMBRAL) return false;
  const last = parseInt((await AsyncStorage.getItem(K_LAST)) || "0", 10);
  if (last && Date.now() - last < DIAS_ESPERA * DIA_MS) return false;
  return true;
}

export async function marcarCalificado() {
  await AsyncStorage.setItem(K_DONE, "1");
}

export async function posponerCalificacion() {
  await AsyncStorage.setItem(K_LAST, String(Date.now()));
}
