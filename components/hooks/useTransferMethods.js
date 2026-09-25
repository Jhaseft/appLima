import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { obtenerMetodos } from "../Tranferencia/services/transferenciaApi";

const CACHE_KEY = "tc_transfer_methods";
const TTL_MS = 10 * 60 * 1000;

// Cache de los metodos de pago de la empresa (agrupados por currency_pair).
// Cambian poco, se comparten entre pasos del wizard; se cachean 10 min con
// stale-while-revalidate para no pedirlos en cada montaje de cada paso.
let memoria = null;
let memoriaTs = 0;

const vencido = (ts) => Date.now() - ts > TTL_MS;

/**
 * Trae los métodos de transferencia desde la BD agrupados por currency_pair.
 *
 * @param {string} currencyPair  "BOBtoPEN" | "PENtoBOB" | null (todos)
 */
export function useTransferMethods(currencyPair = null) {
  const slice = useCallback(
    (data) => (currencyPair ? data?.[currencyPair] ?? [] : data ?? []),
    [currencyPair]
  );

  const [methods, setMethods] = useState(memoria ? slice(memoria) : []);
  const [loading, setLoading] = useState(memoria === null);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    try {
      const data = await obtenerMetodos();
      memoria = data;
      memoriaTs = Date.now();
      AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: memoriaTs }));
      setMethods(slice(data));
    } catch (e) {
      setError(e.message);
    }
  }, [slice]);

  useEffect(() => {
    let vivo = true;

    if (memoria !== null) {
      setMethods(slice(memoria));
      setLoading(false);
      if (vencido(memoriaTs)) cargar();
      return () => { vivo = false; };
    }

    (async () => {
      try {
        const cache = await AsyncStorage.getItem(CACHE_KEY);
        if (cache) {
          const { data, ts } = JSON.parse(cache);
          memoria = data;
          memoriaTs = ts ?? 0;
          if (vivo) setMethods(slice(data));
          if (vencido(memoriaTs)) await cargar();
          return;
        }
        await cargar();
      } catch (e) {
        if (vivo) { setError(e.message); setMethods([]); }
      } finally {
        if (vivo) setLoading(false);
      }
    })();

    return () => { vivo = false; };
  }, [slice, cargar]);

  return { methods, loading, error, reload: cargar };
}
