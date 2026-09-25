import { useHistorialTasas } from "../../hooks/useHistorialTasas";

// Tasa vigente para la cotizacion = ultima fila del historial compartido
// (useHistorialTasas). No hace su propia peticion: comparte cache con Home,
// alineado al worker (5 min). Ver useHistorialTasas.
export function useTasas() {
  const { historial, loading, refreshing, refrescar } = useHistorialTasas();
  const tasa = historial && historial.length ? historial[historial.length - 1] : null;
  return { tasa, loading, refreshing, refrescar };
}
