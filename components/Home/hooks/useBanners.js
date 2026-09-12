import { useCallback, useEffect, useState } from "react";
import { fetchBanners } from "../services/bannersApi";

// banners === null -> cargando (skeleton). banners === [] -> sin banners (no renderiza).
export function useBanners() {
  const [banners, setBanners] = useState(null);

  const load = useCallback(async () => {
    try {
      setBanners(await fetchBanners());
    } catch (err) {
      console.error("Error cargando banners:", err);
      setBanners([]);
    }
  }, []);
 
  useEffect(() => {
    load();
  }, [load]);

  return { banners, reload: load };
}
