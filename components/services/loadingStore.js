// Contador global de peticiones en curso, con suscripción para la UI.
// Vive fuera de React para poder dispararse desde services (sin JSX).
let active = 0;
const listeners = new Set();

const emit = () => listeners.forEach((l) => l(active));

export const start = () => {
  active += 1;
  emit();
};

export const done = () => {
  active = Math.max(0, active - 1);
  emit();
};

export const getActive = () => active;

export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
