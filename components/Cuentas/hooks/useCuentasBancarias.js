import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { listarCuentas, eliminarCuenta } from "../services/cuentasApi";

const CACHE_KEY = "cuentasUsuario";

// Cache en memoria del modulo (por usuario): sobrevive a los remontajes al
// navegar entre pestanas. Solo se llama al backend la PRIMERA vez que no hay
// cache (ni memoria ni disco). Luego la lista se queda fija y solo se refresca
// localmente al crear (guardar) o borrar (eliminar) una cuenta. Asi evitamos
// una peticion GET cada vez que se entra a Cuentas.
let memoria = null;
let memoriaUserId = null;

function memoriaValida(userId) {
  return memoria !== null && memoriaUserId === userId;
}

export function useCuentasBancarias(userId) {
  const [cuentas, setCuentas] = useState(memoriaValida(userId) ? memoria : []);
  const [loading, setLoading] = useState(!memoriaValida(userId));
  const [eliminando, setEliminando] = useState(false);

  const aplicar = useCallback(
    (lista) => {
      memoria = lista;
      memoriaUserId = userId;
      setCuentas(lista);
      AsyncStorage.setItem(CACHE_KEY, JSON.stringify(lista));
    },
    [userId]
  );

  useEffect(() => {
    if (!userId) return;

    if (memoriaValida(userId)) {
      setCuentas(memoria);
      setLoading(false);
      return;
    }

    let vivo = true;
    (async () => {
      try {
        const cache = await AsyncStorage.getItem(CACHE_KEY);
        if (cache) {
          const lista = JSON.parse(cache);
          memoria = lista;
          memoriaUserId = userId;
          if (vivo) setCuentas(lista);
          return;
        }
        const data = await listarCuentas(userId, "bank");
        memoria = data;
        memoriaUserId = userId;
        AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
        if (vivo) setCuentas(data);
      } catch (err) {
        console.error("Error cargando cuentas:", err);
      } finally {
        if (vivo) setLoading(false);
      }
    })();

    return () => {
      vivo = false;
    };
  }, [userId]);

  const guardar = useCallback((lista) => aplicar(lista), [aplicar]);

  const refrescar = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      aplicar(await listarCuentas(userId, "bank"));
    } catch (err) {
      console.error("Error refrescando cuentas:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, aplicar]);

  const eliminar = useCallback(
    async (id) => {
      setEliminando(true);
      try {
        await eliminarCuenta(id);
        aplicar((memoria ?? []).filter((c) => c.id !== id));
      } finally {
        setEliminando(false);
      }
    },
    [aplicar]
  );

  return { cuentas, guardar, loading, eliminando, eliminar, refrescar };
}
