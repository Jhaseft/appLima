import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { getToken } from "../services/authStorage";
import { useUser } from "../../ContextUser/UserContext";
import { routeForUser } from "../../profileStatus";

// Si hay sesión activa decide a dónde entrar (Home o completar perfil);
// si no, libera la pantalla de inicio.
export function useAuthRedirect() {
  const router = useRouter();
  const { fetchUser } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const token = await getToken().catch(() => null);
      if (!token) {
        if (mounted) setLoading(false);
        return;
      }
      const user = await fetchUser();
      if (!mounted) return;
      if (user) router.replace(routeForUser(user));
      else setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { loading };
}
