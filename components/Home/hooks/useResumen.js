import { useCallback, useEffect, useState } from "react";
import { useUser } from "../../ContextUser/UserContext";
import { fetchResumen } from "../services/resumenApi";

// resumen === null -> cargando (skeleton).
export function useResumen() {
  const { user } = useUser();
  const [resumen, setResumen] = useState(null);

  const load = useCallback(async () => {
    if (!user?.id) return;
    try {
      setResumen(await fetchResumen(user.id));
    } catch (err) {
      console.error("Error cargando resumen:", err);
      setResumen({ operaciones: 0, soles: 0, bolivianos: 0 });
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  return { resumen, reload: load };
}
