import { useEffect, useState } from "react";
import { listarBancos } from "../services/cuentasModalApi";

// Cache en memoria: los bancos casi no cambian, se cargan una vez por sesion.
let cache = null;

export function getBancos() {
  return cache;
}

export function useBancos(isOpen, bancosProp) {
  const [bancos, setBancos] = useState(cache || bancosProp || []);

  useEffect(() => {
    if (!isOpen) return;
    if (cache?.length) return setBancos(cache);
    if (bancosProp?.length) {
      cache = bancosProp;
      return setBancos(bancosProp);
    }
    (async () => {
      try {
        const data = await listarBancos();
        cache = data;
        setBancos(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [isOpen, bancosProp]);

  return bancos;
}
