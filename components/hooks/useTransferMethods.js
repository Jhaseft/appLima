import { useState, useEffect } from "react";
import API_BASE_URL from "../api";

/**
 * Trae los métodos de transferencia desde la BD agrupados por currency_pair.
 *
 * @param {string} currencyPair  "BOBtoPEN" | "PENtoBOB" | null (todos)
 * @returns {{ methods: Array, loading: boolean, error: string|null, reload: Function }}
 */
export function useTransferMethods(currencyPair = null) {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/transfer-methods`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      // data = { BOBtoPEN: [...], PENtoBOB: [...] }
      setMethods(currencyPair ? data[currencyPair] ?? [] : data);
    } catch (e) {
      setError(e.message);
      setMethods([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [currencyPair]);

  return { methods, loading, error, reload: load };
}
