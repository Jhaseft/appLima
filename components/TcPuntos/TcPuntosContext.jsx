import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../ContextUser/UserContext";
import { obtenerSaldo } from "./services/tcPuntosApi";
import { invalidarCatalogo } from "./hooks/useCatalogo";
import { invalidarHistorial } from "./hooks/useHistorial";

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
  const [moneda, setMoneda] = useState("S/");
  const [umbral, setUmbral] = useState(1000);
  const usuarioPrevio = useRef(undefined);

  const aplicar = useCallback((b, v, m, u) => {
    setBalance(b);
    setValorPunto(v);
    setMoneda(m);
    setUmbral(u);
    AsyncStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ balance: b, valor_punto: v, moneda: m, umbral: u })
    );
  }, []);

  const limpiar = useCallback(() => {
    setBalance(null);
    setValorPunto(null);
    setMoneda("S/");
    setUmbral(1000);
    AsyncStorage.removeItem(CACHE_KEY);
    invalidarCatalogo();
    invalidarHistorial();
  }, []);

  const refrescar = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const d = await obtenerSaldo();
      aplicar(d.balance ?? 0, d.valor_punto ?? 1, d.moneda ?? "S/", d.umbral ?? 1000);
    } catch (_) {}
  }, [aplicar]);

  const fijarBalance = useCallback((b) => {
    setBalance(b);
    AsyncStorage.mergeItem(CACHE_KEY, JSON.stringify({ balance: b }));
  }, []);

  // Al montar: muestra el saldo cacheado al instante (sin pedir red todavia).
  useEffect(() => {
    (async () => {
      const cache = await AsyncStorage.getItem(CACHE_KEY);
      if (!cache) return;
      const d = JSON.parse(cache);
      setBalance(d.balance ?? 0);
      setValorPunto(d.valor_punto ?? 1);
      setMoneda(d.moneda ?? "S/");
      setUmbral(d.umbral ?? 1000);
    })();
  }, []);

  // Reacciona al usuario: al iniciar o cambiar de sesion refresca su saldo;
  // al cerrar sesion (habia usuario y ahora no) limpia el saldo cacheado.
  useEffect(() => {
    const id = user?.id ?? null;
    if (id) {
      if (usuarioPrevio.current !== id) {
        if (usuarioPrevio.current) {
          invalidarCatalogo();
          invalidarHistorial();
        }
        refrescar();
      }
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
    <TcPuntosContext.Provider value={{ balance, valorPunto, moneda, umbral, refrescar, fijarBalance }}>
      {children}
    </TcPuntosContext.Provider>
  );
}

export function useTcPuntos() {
  const ctx = useContext(TcPuntosContext);
  if (!ctx) throw new Error("useTcPuntos debe usarse dentro de TcPuntosProvider");
  return ctx;
}
