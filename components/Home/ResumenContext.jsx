import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../ContextUser/UserContext";
import { fetchResumen } from "./services/resumenApi";

const CACHE_KEY = "resumen_operaciones";
const ResumenContext = createContext(null);

// Resumen del home (total operaciones, soles y bolivianos cambiados) cacheado.
// Solo cambia cuando el usuario realiza una operacion, asi que no se refresca en
// cada navegacion: se carga del cache al instante y se refresca en momentos
// puntuales (al iniciar/cambiar de sesion y tras crear una operacion). Se limpia
// al cerrar sesion para no arrastrar el resumen del usuario anterior.
export function ResumenProvider({ children }) {
  const { user } = useUser();
  const [resumen, setResumen] = useState(null);
  const usuarioPrevio = useRef(undefined);

  const aplicar = useCallback((r) => {
    setResumen(r);
    AsyncStorage.setItem(CACHE_KEY, JSON.stringify(r));
  }, []);

  const limpiar = useCallback(() => {
    setResumen(null);
    AsyncStorage.removeItem(CACHE_KEY);
  }, []);

  const refrescar = useCallback(async () => {
    if (!user?.id) return;
    try {
      aplicar(await fetchResumen(user.id));
    } catch (err) {
      console.error("Error cargando resumen:", err);
    }
  }, [user?.id, aplicar]);

  // Al montar: muestra el resumen cacheado al instante (sin pedir red todavia).
  useEffect(() => {
    (async () => {
      const cache = await AsyncStorage.getItem(CACHE_KEY);
      if (cache) setResumen(JSON.parse(cache));
    })();
  }, []);

  // Reacciona al usuario: al iniciar o cambiar de sesion refresca su resumen;
  // al cerrar sesion (habia usuario y ahora no) limpia el cacheado.
  useEffect(() => {
    const id = user?.id ?? null;
    if (id) {
      if (usuarioPrevio.current !== id) refrescar();
    } else if (usuarioPrevio.current) {
      limpiar();
    }
    usuarioPrevio.current = id;
  }, [user?.id, refrescar, limpiar]);

  return (
    <ResumenContext.Provider value={{ resumen, refrescar }}>
      {children}
    </ResumenContext.Provider>
  );
}

export function useResumen() {
  const ctx = useContext(ResumenContext);
  if (!ctx) throw new Error("useResumen debe usarse dentro de ResumenProvider");
  return ctx;
}
