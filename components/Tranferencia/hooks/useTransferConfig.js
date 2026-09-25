import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { obtenerConfigTransfer } from "../services/transferenciaApi";

const CACHE_KEY = "tc_transfer_config";
const TTL_MS = 30 * 60 * 1000;

const FALLBACK = {
  min_pen: 20,
  min_bob: 60,
  max_pen: 1000000,
  max_bob: 1000000,
  kyc_limit_pen: 300,
  kyc_limit_bob: 1000,
};

// Cache de la config de limites de transferencia (min/max/kyc). Cambia muy poco,
// asi que se cachea 30 min con stale-while-revalidate. Fallback estatico si la
// red falla y no hay cache, para no bloquear la cotizacion.
let memoria = null;
let memoriaTs = 0;

const vencido = (ts) => Date.now() - ts > TTL_MS;

export function useTransferConfig() {
  const [config, setConfig] = useState(memoria);
  const [ready, setReady] = useState(memoria !== null);

  const aplicar = useCallback((c) => {
    memoria = c;
    memoriaTs = Date.now();
    setConfig(c);
    AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ config: c, ts: memoriaTs }));
  }, []);

  const cargar = useCallback(async () => {
    try {
      aplicar(await obtenerConfigTransfer());
    } catch (_) {
      if (memoria === null) setConfig(FALLBACK);
    }
  }, [aplicar]);

  useEffect(() => {
    let vivo = true;

    if (memoria !== null) {
      if (vencido(memoriaTs)) cargar();
      return () => { vivo = false; };
    }

    (async () => {
      try {
        const cache = await AsyncStorage.getItem(CACHE_KEY);
        if (cache) {
          const { config: c, ts } = JSON.parse(cache);
          memoria = c;
          memoriaTs = ts ?? 0;
          if (vivo) setConfig(c);
          if (vencido(memoriaTs)) await cargar();
          return;
        }
        await cargar();
      } finally {
        if (vivo) setReady(true);
      }
    })();

    return () => { vivo = false; };
  }, [cargar]);

  const refrescar = useCallback(() => cargar(), [cargar]);

  return { config: config ?? FALLBACK, ready, refrescar };
}
