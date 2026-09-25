import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUser } from "../components/ContextUser/UserContext";
import { colors } from "../theme/colors";

export default function KycResultado() {
  const { status } = useLocalSearchParams();
  const router = useRouter();
  const { fetchUser } = useUser();

  useEffect(() => {
    (async () => {
      await fetchUser();
      router.replace("/Home");
    })();
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-background px-8">
      <ActivityIndicator size="large" color={colors.primary} />
      <Text className="text-text text-base font-lm-medium text-center mt-4">
        {status === "approved" ? "KYC verificado. Redirigiendo..." : "Verificando KYC..."}
      </Text>
    </View>
  );
}
