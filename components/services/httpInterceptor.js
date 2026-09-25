import API_BASE_URL from "../api";
import { block } from "./rateLimitStore";

// Interceptor global de fetch: detecta el 429 (rate limit) de NUESTRA API y activa
// el overlay bloqueante con cuenta regresiva (usa retry_after del backend), sin
// tocar cada service. Se instala una sola vez en app/_layout.jsx.
let installed = false;

const urlOf = (input) => (typeof input === "string" ? input : input?.url ?? "");

export function installHttpInterceptor() {
  if (installed) return;
  installed = true;

  const originalFetch = global.fetch;

  global.fetch = async (...args) => {
    const res = await originalFetch(...args);

    if (res.status === 429 && API_BASE_URL && urlOf(args[0]).includes(API_BASE_URL)) {
      handle429(res);
    }

    return res;
  };
}

async function handle429(res) {
  let seconds = 300;
  let message = "Estás realizando demasiadas acciones.";
  try {
    const data = await res.clone().json();
    if (data?.retry_after) seconds = Number(data.retry_after);
    if (data?.message) message = data.message;
  } catch {}

  block(seconds, message);
}
