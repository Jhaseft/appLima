import { useHistorialTasas } from "../../hooks/useHistorialTasas";

// Datos del grafico de Home = ultimas 4 filas del historial compartido
// (useHistorialTasas). Comparte cache con la cotizacion de Transferencias, asi
// el endpoint /tipo-cambio/historial se pide una sola vez por ciclo en la app.
export function useTipoCambio() {
  const { historial, refrescar } = useHistorialTasas();
  const data = historial ? historial.slice(-4) : null;
  return { data, refresh: refrescar };
}
