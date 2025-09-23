import "../global.css";
import { Stack } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
//para poder sacar la info del usuaironen cada pantalla sin necesidad de estarlo cargando cada vez
import { UserProvider } from "../components/ContextUser/UserContext";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  const insets = useSafeAreaInsets();

  return (
    //envolvemos la app en este provider
    <UserProvider>
      <View
        className="flex-1 "
        style={{ paddingBottom: insets.bottom }}
      >
        <StatusBar style="dark" />
        <Stack />
      </View>
    </UserProvider>
  );
}
