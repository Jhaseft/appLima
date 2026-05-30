import "../global.css";
import { Stack, useRouter, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";
import { UserProvider } from "../components/ContextUser/UserContext";
import NetworkGuard from "../components/NetworkGuard/NetworkGuard";
import VersionGuard from "../components/VersionGuard/VersionGuard";
import { BackHandler, Alert } from "react-native";
import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";

export default function Layout() {

  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const notificationListener = useRef();

  // Navegar cuando el usuario toca la notificación
  useEffect(() => {
    notificationListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data?.screen) {
        router.push(data.screen);
      }
    });
    return () => notificationListener.current?.remove();
  }, []);

  useEffect(() => {
    const onBackPress = () => {
      const isHome = pathname === "/Home" || pathname === "/" || pathname === "/index";

      if (!isHome) {
        router.replace("/Home");
        return true;
      }

      Alert.alert(
        "Salir",
        "¿Deseas salir de la aplicación?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Salir", onPress: () => BackHandler.exitApp() },
        ]
      );
      return true;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => subscription.remove();
  }, [pathname]);

  return (
    <UserProvider>
      <View className="flex-1" style={{ paddingBottom: insets.bottom }}>
        <StatusBar style="dark" />
        <NetworkGuard>
          <VersionGuard>
            <Stack />
          </VersionGuard>
        </NetworkGuard>
      </View>
    </UserProvider>
  );
}
