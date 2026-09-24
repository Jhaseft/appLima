import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { listarCuentas } from "../services/cuentasApi";

const CACHE_KEY = "cuentasQR";

// Mismo patron que las cuentas bancarias: cache en memoria por usuario. Solo se
// pide al backend la primera vez que se abre la vista QR sin cache; despues se
// mantiene y solo cambia al registrar/actualizar un QR (fijarQR).
let memoria = null;
let memoriaUserId = null;

function memoriaValida(userId) {
  return memoria !== null && memoriaUserId === userId;
}

export function useCuentasQR(userId, activo) {
  const [qr, setQr] = useState(memoriaValida(userId) ? memoria : { PE: null, BO: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activo || !userId) return;

    if (memoriaValida(userId)) {
      setQr(memoria);
      return;
    }

    let vivo = true;
    (async () => {
      setLoading(true);
      try {
        const cache = await AsyncStorage.getItem(CACHE_KEY);
        if (cache) {
          const parsed = JSON.parse(cache);
          memoria = parsed;
          memoriaUserId = userId;
          if (vivo) setQr(parsed);
          return;
        }
        const data = await listarCuentas(userId, "qr");
        const next = {
          PE: data.find((c) => c.qr_country === "PE") || null,
          BO: data.find((c) => c.qr_country === "BO") || null,
        };
        memoria = next;
        memoriaUserId = userId;
        AsyncStorage.setItem(CACHE_KEY, JSON.stringify(next));
        if (vivo) setQr(next);
      } catch (err) {
        console.error("Error cargando QRs:", err);
      } finally {
        if (vivo) setLoading(false);
      }
    })();

    return () => {
      vivo = false;
    };
  }, [activo, userId]);

  const fijarQR = useCallback(
    (cuenta) => {
      setQr((prev) => {
        const next = { ...prev, [cuenta.qr_country]: cuenta };
        memoria = next;
        memoriaUserId = userId;
        AsyncStorage.setItem(CACHE_KEY, JSON.stringify(next));
        return next;
      });
    },
    [userId]
  );

  const refrescar = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await listarCuentas(userId, "qr");
      const next = {
        PE: data.find((c) => c.qr_country === "PE") || null,
        BO: data.find((c) => c.qr_country === "BO") || null,
      };
      memoria = next;
      memoriaUserId = userId;
      AsyncStorage.setItem(CACHE_KEY, JSON.stringify(next));
      setQr(next);
    } catch (err) {
      console.error("Error refrescando QRs:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return { qr, loading, fijarQR, refrescar };
}
