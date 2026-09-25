import { useEffect, useRef, useState } from "react";
import { useHistorialTasas } from "../../hooks/useHistorialTasas";

// Observa la tasa vigente compartida y avisa cuando cambia durante el flujo de
// operacion. `verificar` fuerza un fetch on-demand (se llama al avanzar cada
// paso); si la tasa cambio respecto a la anterior, baja el banner. No avisa en la
// primera lectura. Compara a 2 decimales (lo que ve el usuario).
export function useRateChangeNotice() {
  const { historial, refrescar } = useHistorialTasas();
  const ultima = historial?.length ? historial[historial.length - 1] : null;
  const compra = ultima ? parseFloat(ultima.compra) : null;
  const venta = ultima ? parseFloat(ultima.venta) : null;

  const [notice, setNotice] = useState(null);
  const prev = useRef(null);

  useEffect(() => {
    if (compra == null || venta == null) return;
    const key = `${compra.toFixed(2)}|${venta.toFixed(2)}`;
    if (prev.current === null) {
      prev.current = key;
      return;
    }
    if (prev.current !== key) {
      prev.current = key;
      setNotice({ compra: compra.toFixed(2), venta: venta.toFixed(2) });
    }
  }, [compra, venta]);

  return { notice, dismiss: () => setNotice(null), verificar: refrescar };
}
