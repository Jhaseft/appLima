import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Platform,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import Constants from "expo-constants";
import API_BASE_URL from "../api";

const STORE_URL = {
  android: "https://play.google.com/store/apps/details?id=com.transfercash.lima",
  ios: "https://apps.apple.com/app/id000000000", // reemplaza con tu App Store ID
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
  const [status, setStatus] = useState("checking"); // "checking" | "ok" | "outdated"

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
      setStatus("ok"); // si falla el endpoint, no bloquear
    }
  };

  if (status === "checking") {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  if (status === "outdated") {
    const storeUrl = Platform.OS === "ios" ? STORE_URL.ios : STORE_URL.android;
    return (
      <View style={styles.container}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Actualización requerida</Text>
        <Text style={styles.subtitle}>
          Hay una nueva versión de Transfer Cash disponible.{"\n"}
          Actualiza para seguir usando la app.
        </Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            v{Constants.expoConfig?.version} → Nueva versión
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => Linking.openURL(storeUrl)}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Actualizar ahora</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          No puedes continuar sin actualizar.
        </Text>
      </View>
    );
  }

  return children;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 36,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: "#fff",
    marginBottom: 36,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 28,
  },
  badge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 100,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginBottom: 40,
  },
  badgeText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#6366F1",
    fontWeight: "bold",
    fontSize: 18,
  },
  footer: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    textAlign: "center",
  },
});
