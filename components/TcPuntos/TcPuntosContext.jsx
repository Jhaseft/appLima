import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../ContextUser/UserContext";
import API_BASE_URL from "../api";

const CACHE_KEY = "tc_puntos_saldo";
const TcPuntosContext = createContext(null);

// Saldo de TC Puntos cacheado. Se carga desde AsyncStorage para mostrarse al
// instante y se refresca en momentos puntuales (al entrar/volver a la app,
// tras una transferencia o un canje), no en cada navegacion. Se limpia al
// cerrar sesion para no arrastrar el saldo del usuario anterior.
export function TcPuntosProvider({ children }) {
  const { user } = useUser();
  const [balance, setBalance] = useState(null);
  const [valorPunto, setValorPunto] = useState(null);
  const valorRef = useRef(1);
  const usuarioPrevio = useRef(undefined);

  const aplicar = useCallback((b, v) => {
    setBalance(b);
    setValorPunto(v);
    valorRef.current = v;
    AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ balance: b, valor_punto: v }));
  }, []);

  const limpiar = useCallback(() => {
    setBalance(null);
    setValorPunto(null);
    valorRef.current = 1;
    AsyncStorage.removeItem(CACHE_KEY);
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

  // Al montar: muestra el saldo cacheado al instante (sin pedir red todavia).
  useEffect(() => {
    (async () => {
      const cache = await AsyncStorage.getItem(CACHE_KEY);
      if (!cache) return;
      const d = JSON.parse(cache);
      setBalance(d.balance ?? 0);
      setValorPunto(d.valor_punto ?? 1);
      valorRef.current = d.valor_punto ?? 1;
    })();
  }, []);

  // Reacciona al usuario: al iniciar o cambiar de sesion refresca su saldo;
  // al cerrar sesion (habia usuario y ahora no) limpia el saldo cacheado.
  useEffect(() => {
    const id = user?.id ?? null;
    if (id) {
      if (usuarioPrevio.current !== id) refrescar();
    } else if (usuarioPrevio.current) {
      limpiar();
    }
    usuarioPrevio.current = id;
  }, [user?.id, refrescar, limpiar]);

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
