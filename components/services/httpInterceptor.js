import API_BASE_URL from "../api";
import { block, blockPermanent } from "./rateLimitStore";
import { expireSession } from "./sessionStore";

// Interceptor global de fetch para NUESTRA API. Detecta y unifica los dos bloqueos
// del backend, sin tocar cada service:
//   - Rate limit (429, o pagina HTML "Too Many Requests" del proxy): TEMPORAL.
//   - Bloqueo del admin (403 con { blocked: true }): PERMANENTE.
//
// Fuerza `Accept: application/json` en cada request para que el backend responda el
// 403 de bloqueo como JSON (sin el header devuelve un redirect HTML y no se podia
// distinguir del rate limit). Al detectar bloqueo lanza un error ANTES de que el
// caller haga res.json(), evitando el "JSON Parse error: Unexpected character <".
let installed = false;

const urlOf = (input) => (typeof input === "string" ? input : input?.url ?? "");

export class RateLimitError extends Error {
  constructor(message) {
    super(message || "Demasiadas peticiones");
    this.name = "RateLimitError";
    this.isRateLimit = true;
  }
}

export class BlockedError extends Error {
  constructor(message) {
    super(message || "Cuenta bloqueada");
    this.name = "BlockedError";
    this.isBlocked = true;
  }
}

export class SessionExpiredError extends Error {
  constructor() {
    super("Sesión expirada");
    this.name = "SessionExpiredError";
    this.isSessionExpired = true;
  }
}

// Inyecta Accept: application/json sin pisar uno ya puesto por el caller.
function conAccept(input, init) {
  if (typeof input !== "string") return [input, init];
  const headers = init?.headers;
  if (headers instanceof Headers) {
    if (!headers.has("Accept")) headers.set("Accept", "application/json");
    return [input, init];
  }
  return [input, { ...init, headers: { Accept: "application/json", ...(headers || {}) } }];
}

async function leerJson(res) {
  try {
    return await res.clone().json();
  } catch {
    return null;
  }
}

export function installHttpInterceptor() {
  if (installed) return;
  installed = true;

  const originalFetch = global.fetch;

  global.fetch = async (input, init = {}) => {
    const esNuestraApi = API_BASE_URL && urlOf(input).includes(API_BASE_URL);
    const [inputFinal, initFinal] = esNuestraApi ? conAccept(input, init) : [input, init];

    const res = await originalFetch(inputFinal, initFinal);
    if (!esNuestraApi) return res;

    // Token invalido/expirado: si habia sesion, se limpia y AuthGuard redirige a la
    // raiz. Se corta la peticion para no seguir procesando una respuesta 401.
    if (res.status === 401) {
      const habiaSesion = await expireSession();
      if (habiaSesion) throw new SessionExpiredError();
    }

    // Bloqueo permanente del admin: 403 con blocked:true.
    if (res.status === 403) {
      const data = await leerJson(res);
      if (data?.blocked) {
        const message = data.message || "Tu cuenta ha sido bloqueada. Comunícate con soporte.";
        blockPermanent(message);
        throw new BlockedError(message);
      }
    }

    // Rate limit temporal: 429, o pagina HTML del proxy.
    const contentType = res.headers.get("content-type") || "";
    const esHtml = contentType.includes("text/html");
    if (res.status === 429 || esHtml) {
      const message = await activarBloqueoTemporal(res);
      throw new RateLimitError(message);
    }

    return res;
  };
}

async function activarBloqueoTemporal(res) {
  let seconds = 300;
  let message = "Realizaste demasiadas acciones seguidas.";
  const data = await leerJson(res);
  if (data?.retry_after) seconds = Number(data.retry_after);
  if (data?.message) message = data.message;

  block(seconds, message);
  return message;
}
