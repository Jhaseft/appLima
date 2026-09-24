import { useEffect, useRef } from "react";
import { BackHandler } from "react-native";
import { useRouter, usePathname, useRootNavigationState } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFeedback } from "../Feedback/FeedbackContext";

const PUBLIC_ROUTES = [
  "/",
  "/index",
  "/Login",
  "/Register",
];

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const navState = useRootNavigationState();
  const feedback = useFeedback();
  const isRedirectingRef = useRef(false);

  // Redirige al inicio si la ruta es protegida y no hay token
  useEffect(() => {
    if (!navState?.key) return;
    if (PUBLIC_ROUTES.includes(pathname)) {
      isRedirectingRef.current = false;
      return;
    }
    if (isRedirectingRef.current) return;

    AsyncStorage.getItem("token").then((token) => {
      if (!token && !isRedirectingRef.current) {
        isRedirectingRef.current = true;
        router.replace("/");
      }
    });
  }, [pathname]);

  // Botón físico atrás: va a Home si hay token, a Inicio si no
  useEffect(() => {
    const onBackPress = () => {
      const isRoot = pathname === "/Home" || pathname === "/" || pathname === "/index";

      if (!isRoot) {
        AsyncStorage.getItem("token").then((token) => {
          router.replace(token ? "/Home" : "/");
        });
        return true;
      }

      feedback
        .confirm({
          title: "Salir",
          message: "¿Deseas salir de la aplicación?",
          confirmText: "Salir",
          destructive: true,
        })
        .then((ok) => {
          if (ok) BackHandler.exitApp();
        });
      return true;
    };

    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, [pathname, feedback]);

  return children;
}
