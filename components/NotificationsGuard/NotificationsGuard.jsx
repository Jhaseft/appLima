import { useEffect, useRef, useState } from "react";
import { useRouter, useRootNavigationState } from "expo-router";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTcPuntos } from "../TcPuntos/TcPuntosContext";

let coldStartHandled = false;

export default function NotificationsGuard({ children }) {
  const router = useRouter();
  const navState = useRootNavigationState();
  const { refrescar: refrescarTcPuntos } = useTcPuntos();
  const listenerRef = useRef();
  const receivedRef = useRef();
  const [coldScreen, setColdScreen] = useState(null);

  // App en foreground / background: navega a la pantalla del push
  useEffect(() => {
    listenerRef.current = Notifications.addNotificationResponseReceivedListener((response) => {
      refrescarTcPuntos();
      const screen = response.notification.request.content.data?.screen;
      if (screen) router.push(screen);
    });

    // Push recibida con la app abierta: el admin pudo completar una operacion,
    // asi que refrescamos el saldo de TC Puntos.
    receivedRef.current = Notifications.addNotificationReceivedListener(() => {
      refrescarTcPuntos();
    });

    // App cerrada (killed): guardamos la pantalla para navegar cuando el Stack esté listo
    if (!coldStartHandled) {
      coldStartHandled = true;
      Notifications.getLastNotificationResponseAsync().then((response) => {
        const screen = response?.notification?.request?.content?.data?.screen;
        if (screen) setColdScreen(screen);
      });
    }

    return () => {
      listenerRef.current?.remove();
      receivedRef.current?.remove();
    };
  }, []);

  // Navega al cold screen solo cuando el navigator esté listo, verificando token
  useEffect(() => {
    if (!coldScreen || !navState?.key) return;
    AsyncStorage.getItem("token").then((token) => {
      if (token) refrescarTcPuntos();
      router.replace(token ? coldScreen : "/");
      setColdScreen(null);
    });
  }, [coldScreen, navState?.key]);

  return children;
}
