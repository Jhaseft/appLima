import { start, done } from "./loadingStore";

// Igual que fetch, pero activa el loader global mientras dura la petición.
// Pasar { silent: true } para peticiones de fondo que no deben bloquear la UI.
export async function apiFetch(url, init = {}) {
  const { silent, ...options } = init;
  if (!silent) start();
  try {
    return await fetch(url, options);
  } finally {
    if (!silent) done();
  }
}
