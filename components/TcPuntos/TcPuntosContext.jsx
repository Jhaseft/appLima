import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../api";

const CACHE_KEY = "tc_puntos_saldo";
const TcPuntosContext = createContext(null);

// Saldo de TC Puntos cacheado. Se carga una vez desde AsyncStorage y solo se
// refresca cuando se pide explicitamente (tras una transferencia o un canje),
// no en cada navegacion.
export function TcPuntosProvider({ children }) {
  const [balance, setBalance] = useState(null);
  const [valorPunto, setValorPunto] = useState(null);
  const cargado = useRef(false);
  const valorRef = useRef(1);

  const aplicar = useCallback((b, v) => {
    setBalance(b);
    setValorPunto(v);
    valorRef.current = v;
    AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ balance: b, valor_punto: v }));
  }, []);

  const refrescar = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`${API_BASE_URL}/api/tc-puntos/saldo`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (!res.ok) return;
      const d = await res.json();
      aplicar(d.balance ?? 0, d.valor_punto ?? 1);
    } catch (_) {}
  }, [aplicar]);

  const fijarBalance = useCallback((b) => {
    aplicar(b, valorRef.current);
  }, [aplicar]);

  // Al entrar a la app: muestra el saldo cacheado al instante y lo refresca una vez.
  useEffect(() => {
    if (cargado.current) return;
    cargado.current = true;
    (async () => {
      const cache = await AsyncStorage.getItem(CACHE_KEY);
      if (cache) {
        const d = JSON.parse(cache);
        setBalance(d.balance ?? 0);
        setValorPunto(d.valor_punto ?? 1);
        valorRef.current = d.valor_punto ?? 1;
      }
      refrescar();
    })();
  }, [refrescar]);

  // Al volver la app a primer plano, refresca el saldo (por si el admin
  // completo una operacion mientras estaba cerrada o en segundo plano).
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") refrescar();
    });
    return () => sub.remove();
  }, [refrescar]);

  return (
    <TcPuntosContext.Provider value={{ balance, valorPunto, refrescar, fijarBalance }}>
      {children}
    </TcPuntosContext.Provider>
  );
}

export function useTcPuntos() {
  const ctx = useContext(TcPuntosContext);
  if (!ctx) throw new Error("useTcPuntos debe usarse dentro de TcPuntosProvider");
  return ctx;
}
