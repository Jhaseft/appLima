import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBanners } from "../services/bannersApi";

const CACHE_KEY = "home_banners";
const CACHE_TIME_KEY = "home_banners_update";
const ONE_HOUR = 60 * 60 * 1000;

// Cache en memoria del modulo: sobrevive a los remontajes de Home al navegar,
// asi no hay parpadeo de skeleton ni lectura de disco al volver a Inicio.
let memoria = null;

// banners === null -> cargando (skeleton). banners === [] -> sin banners.
// Los banners casi no cambian (solo cuando el admin los edita), asi que se
// muestran desde cache al instante y solo se revalida si estan vencidos (1h) o
// en pull-to-refresh.
export function useBanners() {
  const [banners, setBanners] = useState(memoria);

  const aplicar = useCallback((list) => {
    memoria = list;
    setBanners(list);
    AsyncStorage.setItem(CACHE_KEY, JSON.stringify(list));
    AsyncStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
  }, []);

  const reload = useCallback(async () => {
    try {
      aplicar(await fetchBanners());
    } catch (err) {
      console.error("Error cargando banners:", err);
      if (memoria === null) setBanners([]);
    }
  }, [aplicar]);

  useEffect(() => {
    if (memoria !== null) return;
    (async () => {
      try {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        const lastUpdate = await AsyncStorage.getItem(CACHE_TIME_KEY);
        const fresco = lastUpdate && Date.now() - parseInt(lastUpdate) < ONE_HOUR;

        if (cached) {
          const list = JSON.parse(cached);
          memoria = list;
          setBanners(list);
          if (fresco) return;
        }
        await reload();
      } catch (err) {
        console.error("Error cargando banners:", err);
        setBanners([]);
      }
    })();
  }, [reload]);

  return { banners, reload };
}
