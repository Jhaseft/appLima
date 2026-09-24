import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { obtenerHistorial } from "../services/tcPuntosApi";

const CACHE_KEY = "tc_puntos_historial";
const TTL_MS = 5 * 60 * 1000;

// Cache del historial de puntos (stale-while-revalidate). Muestra al instante lo
// cacheado y revalida en silencio si esta vencido. Tras un canje se invalida
// (invalidarHistorial) para que la proxima visita traiga el movimiento nuevo.
let memoria = null;
let memoriaTs = 0;

const vencido = (ts) => Date.now() - ts > TTL_MS;

export function invalidarHistorial() {
  memoria = null;
  memoriaTs = 0;
  AsyncStorage.removeItem(CACHE_KEY);
}

export function useHistorial() {
  const [historial, setHistorial] = useState(memoria ?? []);
  const [loading, setLoading] = useState(memoria === null);
  const [refreshing, setRefreshing] = useState(false);

  const aplicar = useCallback((lista) => {
    memoria = lista;
    memoriaTs = Date.now();
    setHistorial(lista);
    AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ lista, ts: memoriaTs }));
  }, []);

  const cargar = useCallback(async () => {
    try {
      aplicar(await obtenerHistorial());
    } catch (_) {}
  }, [aplicar]);

  useEffect(() => {
    let vivo = true;

    if (memoria !== null) {
      setHistorial(memoria);
      setLoading(false);
      if (vencido(memoriaTs)) cargar();
      return () => { vivo = false; };
    }

    (async () => {
      try {
        const cache = await AsyncStorage.getItem(CACHE_KEY);
        if (cache) {
          const { lista, ts } = JSON.parse(cache);
          memoria = lista;
          memoriaTs = ts ?? 0;
          if (vivo) {
            setHistorial(lista);
            setLoading(false);
          }
          if (vencido(memoriaTs)) cargar();
          return;
        }
        await cargar();
      } catch (_) {
      } finally {
        if (vivo) setLoading(false);
      }
    })();

    return () => { vivo = false; };
  }, [cargar]);

  const refrescar = useCallback(async () => {
    setRefreshing(true);
    await cargar();
    setRefreshing(false);
  }, [cargar]);

  return { historial, loading, refreshing, refrescar };
}
