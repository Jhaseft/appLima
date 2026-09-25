import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { obtenerHistorialTasas } from "../Tranferencia/services/transferenciaApi";

const CACHE_KEY = "tc_historial_tasas";
const TTL_MS = 5 * 60 * 1000;

// Fuente UNICA del historial de tipo de cambio (endpoint /tipo-cambio/historial).
// Lo consumen Home (grafico, ultimas 4) y Transferencias (cotiza, la ultima) a
// traves de un solo cache de modulo + disco, alineado al worker (5 min). Asi el
// endpoint se pide una sola vez en toda la app por ciclo, no una por pantalla.
let memoria = null;
let memoriaTs = 0;

const vencido = (ts) => Date.now() - ts > TTL_MS;

export function useHistorialTasas() {
  const [historial, setHistorial] = useState(memoria);
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
      aplicar(await obtenerHistorialTasas());
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
          if (vivo) { setHistorial(lista); setLoading(false); }
          if (vencido(memoriaTs)) await cargar();
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
