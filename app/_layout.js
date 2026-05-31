import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

import { UserProvider } from "../components/ContextUser/UserContext";
import NetworkGuard from "../components/NetworkGuard/NetworkGuard";
import VersionGuard from "../components/VersionGuard/VersionGuard";
import AuthGuard from "../components/AuthGuard/AuthGuard";
import NotificationsGuard from "../components/NotificationsGuard/NotificationsGuard";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <UserProvider>
      <View className="flex-1" style={{ paddingBottom: insets.bottom, backgroundColor: "#000000" }}>
        <StatusBar style="dark" />
        <NetworkGuard>
          <VersionGuard>
            <AuthGuard>
              <NotificationsGuard>
                <Stack />
              </NotificationsGuard>
            </AuthGuard>
          </VersionGuard>
        </NetworkGuard>
      </View>
    </UserProvider>
  );
}
