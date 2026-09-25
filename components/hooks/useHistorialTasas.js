import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { obtenerHistorialTasas } from "../Tranferencia/services/transferenciaApi";

const CACHE_KEY = "tc_historial_tasas";
const TTL_MS = 5 * 60 * 1000;

// Fuente UNICA y REACTIVA del historial de tipo de cambio (endpoint
// /tipo-cambio/historial). Un solo cache de modulo + disco, alineado al worker
// (5 min), compartido por Home (grafico) y Transferencias (cotiza). Los
// suscriptores se re-renderizan cuando la tasa cambia; el flujo de operacion
// re-verifica la tasa on-demand al avanzar cada paso (ver useRateChangeNotice) y
// la revalida en el submit (useFinalizar), asi siempre se aplica el ultimo tipo
// de cambio (el backend cobra con TipoCambio::latest()). Sin polling.
let memoria = null;
let memoriaTs = 0;
let inFlight = null;
let hydrated = false;
const listeners = new Set();

const vencido = (ts) => Date.now() - ts > TTL_MS;

const notify = () => listeners.forEach((fn) => fn(memoria));

function aplicar(lista) {
  memoria = lista;
  memoriaTs = Date.now();
  notify();
  AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ lista, ts: memoriaTs })).catch(() => {});
}

function cargar() {
  if (inFlight) return inFlight;
  inFlight = (async () => {
    try {
      aplicar(await obtenerHistorialTasas());
    } catch (_) {
    } finally {
      inFlight = null;
    }
  })();
  return inFlight;
}

const ensureFresh = () => (vencido(memoriaTs) ? cargar() : Promise.resolve());

async function hydrate() {
  if (hydrated) return;
  hydrated = true;
  if (memoria !== null) return;
  try {
    const cache = await AsyncStorage.getItem(CACHE_KEY);
    if (cache) {
      const { lista, ts } = JSON.parse(cache);
      memoria = lista;
      memoriaTs = ts ?? 0;
      notify();
    }
  } catch (_) {}
}

export function useHistorialTasas() {
  const [historial, setHistorial] = useState(memoria);
  const [loading, setLoading] = useState(memoria === null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let mounted = true;
    const listener = (lista) => {
      setHistorial(lista);
      if (lista !== null) setLoading(false);
    };
    listeners.add(listener);

    (async () => {
      await hydrate();
      if (mounted && memoria !== null) {
        setHistorial(memoria);
        setLoading(false);
      }
      await ensureFresh();
    })();

    return () => {
      mounted = false;
      listeners.delete(listener);
    };
  }, []);

  const refrescar = useCallback(async () => {
    setRefreshing(true);
    await cargar();
    setRefreshing(false);
    return memoria;
  }, []);

  return { historial, loading, refreshing, refrescar };
}
