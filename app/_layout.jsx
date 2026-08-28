import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";

import { UserProvider } from "../components/ContextUser/UserContext";
import AnimatedSplash from "../components/AnimatedSplash";
import LoadingOverlay from "../components/LoadingOverlay";
import NetworkGuard from "../components/NetworkGuard/NetworkGuard";
import VersionGuard from "../components/VersionGuard/VersionGuard";
import AuthGuard from "../components/AuthGuard/AuthGuard";
import NotificationsGuard from "../components/NotificationsGuard/NotificationsGuard";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const insets = useSafeAreaInsets();
  const [animationDone, setAnimationDone] = useState(false);
  const [fontsLoaded] = useFonts({
    "LemonMilkPro-Light": require("../assets/fonts/lemon-milk-pro-ftr-ultralight.otf"),
    LemonMilkPro: require("../assets/fonts/lemon-milk-pro-ftr-regular.otf"),
    "LemonMilkPro-Medium": require("../assets/fonts/lemon-milk-pro-ftr-medium.otf"),
    "LemonMilkPro-Bold": require("../assets/fonts/lemon-milk-pro-ftr-bold.otf"),
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <UserProvider>
      <View className="flex-1 bg-background" style={{ paddingBottom: insets.bottom }}>
        <StatusBar style="dark" />
        <NetworkGuard>
          <VersionGuard>
            <AuthGuard>
              <NotificationsGuard>
                <Stack
                  screenOptions={{
                    // iOS muestra por defecto la flecha + el título de la
                    // pantalla anterior (ej. "‹ Cambiar"). "minimal" deja
                    // solo la flecha, igual que Android.
                    headerBackButtonDisplayMode: "minimal",
                  }}
                />
              </NotificationsGuard>
            </AuthGuard>
          </VersionGuard>
        </NetworkGuard>
      </View>
      <LoadingOverlay />
      {!animationDone && <AnimatedSplash onFinish={() => setAnimationDone(true)} />}
    </UserProvider>
  );
}
