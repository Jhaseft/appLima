import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import Constants from "expo-constants";
import API_BASE_URL from "../api";

const STORE_URL = {
  android: "https://play.google.com/store/apps/details?id=com.transfercash.lima",
  ios: "https://apps.apple.com/app/id000000000",
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
      const res = await fetch(`${API_BASE_URL}/api/version-minima`, {
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
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#000000" />
        <Text className="mt-4 text-sm text-neutral-400 tracking-widest uppercase font-medium">
          Verificando versión...
        </Text>
      </View>
    );
  }

  if (status === "outdated") {
    const storeUrl = Platform.OS === "ios" ? STORE_URL.ios : STORE_URL.android;
    return (
      <View className="flex-1 bg-black items-center justify-center px-9">

        {/* Logo con borde blanco sutil */}
        <View className="w-24 h-24 rounded-3xl bg-white items-center justify-center mb-10 shadow-lg">
          <Image
            source={require("../../assets/logo.png")}
            className="w-20 h-20 rounded-2xl"
            resizeMode="contain"
          />
        </View>

        
        <View className="bg-neutral-800 border border-neutral-700 rounded-full px-4 py-1.5 mb-6">
          <Text className="text-neutral-400 text-xs font-semibold tracking-widest uppercase">
            Actualización requerida
          </Text>
        </View>

       
        <Text className="text-white text-3xl font-bold text-center mb-4 leading-tight">
          Nueva versión{"\n"}disponible
        </Text>

       
        <Text className="text-neutral-400 text-base text-center leading-relaxed mb-8">
          Para seguir usando Transfer Cash necesitas instalar la última versión de la app.
        </Text>

       
        <View className="flex-row items-center bg-neutral-900 border border-neutral-800 rounded-full px-5 py-2 mb-10">
          <View className="w-2 h-2 rounded-full bg-neutral-500 mr-2" />
          <Text className="text-neutral-500 text-xs font-mono">
            v{Constants.expoConfig?.version}
          </Text>
          <Text className="text-neutral-600 mx-2">→</Text>
          <View className="w-2 h-2 rounded-full bg-white mr-2" />
          <Text className="text-white text-xs font-mono font-semibold">
            Nueva versión
          </Text>
        </View>

      
        <TouchableOpacity
          className="bg-white w-full py-4 rounded-2xl items-center mb-4 active:opacity-80"
          onPress={() => Linking.openURL(storeUrl)}
          activeOpacity={0.85}
        >
          <Text className="text-black font-bold text-base tracking-wide">
            Actualizar ahora
          </Text>
        </TouchableOpacity>

      
        <Text className="text-neutral-700 text-xs text-center mt-2">
          No puedes continuar sin actualizar
        </Text>
      </View>
    );
  }

  return children;
}
