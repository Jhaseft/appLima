import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";
import { UserProvider } from "../components/ContextUser/UserContext";
import NetworkGuard from "../components/NetworkGuard/NetworkGuard"; //  nuevo componente

export default function Layout() {
  const insets = useSafeAreaInsets();

  return (
    <UserProvider>
      <View className="flex-1" style={{ paddingBottom: insets.bottom }}>
        <StatusBar style="dark" />
        <NetworkGuard>  
          <Stack />
        </NetworkGuard>
      </View>
    </UserProvider>
  );
}
