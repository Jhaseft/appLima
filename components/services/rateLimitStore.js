// Estado global del bloqueo, fuera de React para poder dispararse desde el
// interceptor de fetch. La UI (RateLimitOverlay) se suscribe. Hay dos tipos:
//   - rate limit (429): TEMPORAL, con cuenta regresiva (`until`).
//   - admin (403 blocked): PERMANENTE, hasta que el admin desbloquee (`permanent`).
let until = 0; // epoch ms en que termina el bloqueo temporal
let message = "";
let permanent = false; // bloqueo del admin: no expira solo
const listeners = new Set();

const emit = () => listeners.forEach((l) => l({ until, message, permanent }));

// Bloqueo temporal por rate limit. No degrada un bloqueo permanente vigente.
export const block = (seconds, msg = "") => {
  if (permanent) return;
  const end = Date.now() + Math.max(1, seconds) * 1000;
  if (end > until) {
    until = end;
    message = msg;
    emit();
  }
};

// Bloqueo permanente por el admin: se mantiene hasta cerrar sesión / desbloqueo.
export const blockPermanent = (msg = "") => {
  permanent = true;
  message = msg || "Tu cuenta ha sido bloqueada. Comunícate con soporte.";
  until = 0;
  emit();
};

export const clearBlock = () => {
  until = 0;
  message = "";
  permanent = false;
  emit();
};

export const getState = () => ({ until, message, permanent });

export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
