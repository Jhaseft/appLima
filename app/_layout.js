import "../global.css";
import { Stack } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Layout() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 "
      style={{  paddingBottom: insets.bottom   }}
    >
      <Stack 
      />
    </View>
  );
}
