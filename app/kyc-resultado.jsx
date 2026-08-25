import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUser } from "../components/ContextUser/UserContext";

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
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
      <ActivityIndicator size="large" color="#000" />
      <Text style={{ marginTop: 16, fontSize: 16, color: "#000" }}>
        {status === "approved" ? "KYC verificado. Redirigiendo..." : "Verificando KYC..."}
      </Text>
    </View>
  );
}
