import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../api";

const CACHE_KEY = "tipoCambio";
const CACHE_TIME_KEY = "tipoCambioUpdate";
const FIVE_MINUTES = 5 * 60 * 1000;

export function useTipoCambio() {
  const [data, setData] = useState(null);

  const fetchFresh = useCallback(async () => {
    const res = await fetch(`${API_BASE_URL}/api/tipo-cambio/historial`);
    const json = await res.json();
    const sliced = json.slice(-4);

    setData(sliced);
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(sliced));
    await AsyncStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
    return sliced;
  }, []);

  const load = useCallback(async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      const lastUpdate = await AsyncStorage.getItem(CACHE_TIME_KEY);
      const now = Date.now();

      if (cached && lastUpdate && now - parseInt(lastUpdate) < FIVE_MINUTES) {
        setData(JSON.parse(cached));
        return;
      }

      await fetchFresh();
    } catch (err) {
      console.error(err);
    }
  }, [fetchFresh]);

  const refresh = useCallback(async () => {
    try {
      await fetchFresh();
    } catch (err) {
      console.error(err);
    }
  }, [fetchFresh]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, refresh };
}
