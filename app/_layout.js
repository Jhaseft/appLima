import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";
import { UserProvider } from "../components/ContextUser/UserContext";
import NetworkGuard from "../components/NetworkGuard/NetworkGuard";
import VersionGuard from "../components/VersionGuard/VersionGuard";
import { BackHandler, ToastAndroid } from "react-native";
import { useEffect, useRef } from "react";
export default function Layout() {

  const insets = useSafeAreaInsets();

  const backPressCount = useRef(0);

  useEffect(() => {
    const onBackPress = () => {
      if (backPressCount.current === 0) {
        backPressCount.current += 1;

        ToastAndroid.show("Presiona otra vez para salir", ToastAndroid.SHORT);

        setTimeout(() => {
          backPressCount.current = 0;
        }, 2000);

        return true; // bloquea el comportamiento normal
      } else {
        BackHandler.exitApp();
        return true;
      }
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => subscription.remove();
  }, []);

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
