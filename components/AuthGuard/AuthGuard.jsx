import { useEffect, useRef } from "react";
import { BackHandler, Alert } from "react-native";
import { useRouter, usePathname, useRootNavigationState } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

      Alert.alert("Salir", "¿Deseas salir de la aplicación?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Salir", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, [pathname]);

  return children;
}
