import { useEffect, useRef, useState } from "react";
import { useRouter, useRootNavigationState } from "expo-router";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

let coldStartHandled = false;

export default function NotificationsGuard({ children }) {
  const router = useRouter();
  const navState = useRootNavigationState();
  const listenerRef = useRef();
  const [coldScreen, setColdScreen] = useState(null);

  // App en foreground / background: navega a la pantalla del push
  useEffect(() => {
    listenerRef.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const screen = response.notification.request.content.data?.screen;
      if (screen) router.push(screen);
    });

    // App cerrada (killed): guardamos la pantalla para navegar cuando el Stack esté listo
    if (!coldStartHandled) {
      coldStartHandled = true;
      Notifications.getLastNotificationResponseAsync().then((response) => {
        const screen = response?.notification?.request?.content?.data?.screen;
        if (screen) setColdScreen(screen);
      });
    }

    return () => listenerRef.current?.remove();
  }, []);

  // Navega al cold screen solo cuando el navigator esté listo, verificando token
  useEffect(() => {
    if (!coldScreen || !navState?.key) return;
    AsyncStorage.getItem("token").then((token) => {
      router.replace(token ? coldScreen : "/");
      setColdScreen(null);
    });
  }, [coldScreen, navState?.key]);

  return children;
}
