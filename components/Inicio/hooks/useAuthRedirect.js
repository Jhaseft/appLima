import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { getToken } from "../services/authStorage";

// Si hay sesión activa redirige a /Home; si no, libera la pantalla de inicio.
export function useAuthRedirect() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const token = await getToken().catch(() => null);
      if (token) router.replace("/Home");
      else if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [router]);

  return { loading };
}
