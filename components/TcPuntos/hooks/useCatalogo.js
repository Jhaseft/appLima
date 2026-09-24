import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { obtenerCatalogo } from "../services/tcPuntosApi";

const CACHE_KEY = "tc_puntos_catalogo";
const TTL_MS = 10 * 60 * 1000;

// Cache del catalogo de canjes (stale-while-revalidate). El catalogo lo controla
// el admin, asi que se muestra al instante desde memoria/disco y solo se pide a la
// red la primera vez o cuando la copia cacheada supera el TTL. La revalidacion es
// silenciosa: no muestra skeleton si ya hay algo que pintar. Asi evitamos un GET
// del catalogo en cada navegacion a la pestana.
let memoria = null;
let memoriaTs = 0;

const vencido = (ts) => Date.now() - ts > TTL_MS;

export function invalidarCatalogo() {
  memoria = null;
  memoriaTs = 0;
  AsyncStorage.removeItem(CACHE_KEY);
}

export function useCatalogo() {
  const [categorias, setCategorias] = useState(memoria ?? []);
  const [loading, setLoading] = useState(memoria === null);
  const [refreshing, setRefreshing] = useState(false);

  const aplicar = useCallback((lista) => {
    memoria = lista;
    memoriaTs = Date.now();
    setCategorias(lista);
    AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ lista, ts: memoriaTs }));
  }, []);

  const cargar = useCallback(async () => {
    try {
      aplicar(await obtenerCatalogo());
    } catch (_) {}
  }, [aplicar]);

  useEffect(() => {
    let vivo = true;

    if (memoria !== null) {
      setCategorias(memoria);
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
            setCategorias(lista);
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

  return { categorias, loading, refreshing, refrescar };
}
