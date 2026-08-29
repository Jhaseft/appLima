import { View } from "react-native";
import { Stack } from "expo-router";
import { useAuthRedirect } from "../components/Inicio/hooks/useAuthRedirect";
import WelcomeCarousel from "../components/Inicio/WelcomeCarousel";
import AuthActions from "../components/Inicio/AuthActions";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function Index() {
  const { loading } = useAuthRedirect();
  const insets = useSafeAreaInsets();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Stack.Screen options={{ headerShown: false }} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background px-6 pb-2" style={{ paddingTop: insets.top}}>
      <Stack.Screen options={{ headerShown: false }} />
      <WelcomeCarousel />
      <AuthActions />
    </View>
  );
}
