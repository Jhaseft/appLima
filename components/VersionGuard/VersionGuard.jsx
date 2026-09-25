import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Platform,
  Image,
} from "react-native";
import Constants from "expo-constants";
import { apiFetch } from "../services/apiFetch";
import API_BASE_URL from "../api";

const STORE_URL = {
  android: "https://play.google.com/store/apps/details?id=com.transfercash.lima",
  ios: "https://apps.apple.com/app/id6788919096",
};

function parseVersion(v = "0") {
  return String(v).split(".").map(Number);
}

function isOutdated(current, minimum) {
  const curr = parseVersion(current);
  const min = parseVersion(minimum);
  for (let i = 0; i < Math.max(curr.length, min.length); i++) {
    const c = curr[i] ?? 0;
    const m = min[i] ?? 0;
    if (c < m) return true;
    if (c > m) return false;
  }
  return false;
}

export default function VersionGuard({ children }) {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    checkVersion();
  }, []);

  const checkVersion = async () => {
    try {
      const current = Constants.expoConfig?.version ?? "0";
      const res = await apiFetch(`${API_BASE_URL}/api/version-minima`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) { setStatus("ok"); return; }
      const { version_minima } = await res.json();
      setStatus(isOutdated(current, version_minima) ? "outdated" : "ok");
    } catch {
      setStatus("ok");
    }
  };

  if (status === "checking") {
    return <View className="flex-1 bg-background" />;
  }

  if (status === "outdated") {
    const storeUrl = Platform.OS === "ios" ? STORE_URL.ios : STORE_URL.android;
    return (
      <View className="flex-1 bg-background items-center justify-center px-9">
        <View className="w-24 h-24 rounded-3xl bg-surface border border-border items-center justify-center mb-10">
          <Image
            source={require("../../assets/images/logo.png")}
            className="w-20 h-20 rounded-2xl"
            resizeMode="contain"
          />
        </View>

        <View className="bg-primary-light border border-primary-accent rounded-full px-4 py-1.5 mb-6">
          <Text className="text-primary-dark text-xs font-lm-bold tracking-widest uppercase">
            Actualización requerida
          </Text>
        </View>

        <Text className="text-text text-3xl font-lm-bold text-center mb-4 leading-tight">
          Nueva versión{"\n"}disponible
        </Text>

        <Text className="text-text-muted text-base font-sans text-center leading-relaxed mb-8">
          Para seguir usando Transfer Cash necesitas instalar la última versión de la app.
        </Text>

        <View className="flex-row items-center bg-surface border border-border rounded-full px-5 py-2 mb-10">
          <View className="w-2 h-2 rounded-full bg-text-muted mr-2" />
          <Text className="text-text-muted text-xs font-sans">
            v{Constants.expoConfig?.version}
          </Text>
          <Text className="text-text-muted mx-2">→</Text>
          <View className="w-2 h-2 rounded-full bg-primary mr-2" />
          <Text className="text-text text-xs font-lm-medium">
            Nueva versión
          </Text>
        </View>

        <TouchableOpacity
          className="bg-primary w-full py-4 rounded-2xl items-center mb-4 active:opacity-80"
          onPress={() => Linking.openURL(storeUrl)}
          activeOpacity={0.85}
        >
          <Text className="text-text font-lm-bold text-base tracking-wide">
            Actualizar ahora
          </Text>
        </TouchableOpacity>

        <Text className="text-text-muted text-xs font-sans text-center mt-2">
          No puedes continuar sin actualizar
        </Text>
      </View>
    );
  }

  return children;
}
