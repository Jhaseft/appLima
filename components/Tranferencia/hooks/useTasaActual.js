import { useHistorialTasas } from "../../hooks/useHistorialTasas";

// Tasa vigente = SIEMPRE la ultima fila de la tabla (via cache compartido). El
// backend cobra con TipoCambio::latest() al crear la operacion, asi que el front
// tambien muestra la ultima (no una "congelada" del paso 1). Si la tabla cambia,
// cambia aca. Ver useHistorialTasas / OperacionController::crearTransferencia.
export function useTasaActual() {
  const { historial } = useHistorialTasas();
  const ultima = historial && historial.length ? historial[historial.length - 1] : null;
  return {
    compra: ultima ? parseFloat(ultima.compra) : null,
    venta: ultima ? parseFloat(ultima.venta) : null,
  };
}

export function calcularConversion(monto, modo, { compra, venta }) {
  const valor = parseFloat(String(monto ?? "").replace(",", "."));
  if (isNaN(valor) || !compra || !venta) return "";
  return modo === "PENtoBOB" ? (valor * compra).toFixed(2) : (valor / venta).toFixed(2);
}
