// Estado global del bloqueo por rate limit (429), fuera de React para poder
// dispararse desde el interceptor de fetch. La UI (RateLimitOverlay) se suscribe.
let until = 0; // epoch ms en que termina el bloqueo
let message = "";
const listeners = new Set();

const emit = () => listeners.forEach((l) => l({ until, message }));

// Bloquea por `seconds`. Si ya hay un bloqueo mayor vigente, no lo acorta.
export const block = (seconds, msg = "") => {
  const end = Date.now() + Math.max(1, seconds) * 1000;
  if (end > until) {
    until = end;
    message = msg;
    emit();
  }
};

export const clearBlock = () => {
  until = 0;
  message = "";
  emit();
};

export const getState = () => ({ until, message });

export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
