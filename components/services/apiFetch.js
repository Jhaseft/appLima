import { start, done } from "./loadingStore";

// Igual que fetch, pero enciende el loader global mientras dura la petición.
// Se usa solo en los flujos de inicio, login y registro.
// Pasar { silent: true } para peticiones que no deben bloquear la UI.
export async function apiFetch(url, init = {}) {
  const { silent, ...options } = init;
  if (!silent) start();
  try {
    return await fetch(url, options);
  } finally {
    if (!silent) done();
  }
}
