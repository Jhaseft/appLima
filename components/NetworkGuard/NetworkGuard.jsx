import { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import * as Network from "expo-network";
import { colors } from "../../theme/colors";

const LATENCY_WARNING_MS = 1500;

async function measureLatency() {
  try {
    const start = Date.now();
    await fetch("https://www.google.com", { method: "HEAD", cache: "no-cache" });
    return Date.now() - start;
  } catch {
    return null;
  }
}

export default function NetworkGuard({ children }) {
  const [status, setStatus] = useState("checking"); // "checking" | "offline" | "unstable" | "online"
  const [checking, setChecking] = useState(false);
  const statusRef = useRef("checking");
  const wasDisconnected = useRef(false);

  const applyStatus = (s) => {
    statusRef.current = s;
    setStatus(s);
  };

  const checkConnection = async () => {
    setChecking(true);
    try {
      const state = await Network.getNetworkStateAsync();
      const connected = state.isConnected && state.isInternetReachable;

      if (!connected) {
        wasDisconnected.current = true;
        applyStatus("offline");
        return;
      }

      const latency = await measureLatency();

      if (latency === null) {
        wasDisconnected.current = true;
        applyStatus("offline");
        return;
      }

      const isUnstable = latency > LATENCY_WARNING_MS;

      wasDisconnected.current = false;
      applyStatus(isUnstable ? "unstable" : "online");
    } catch {
      wasDisconnected.current = true;
      applyStatus("offline");
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();

    // Solo detecta cuando se pierde la conexión — la recuperación es manual via "Reintentar"
    const subscription = Network.addNetworkStateListener((state) => {
      const connected = state.isConnected && state.isInternetReachable;
      if (!connected) {
        wasDisconnected.current = true;
        applyStatus("offline");
      }
    });

    return () => subscription.remove();
  }, []);

  if (status === "checking") {
    return (
      <View className="absolute inset-0 z-50 w-full h-full justify-center items-center bg-background">
        <ActivityIndicator color={colors.primary} size="large" />
        <Text className="mt-4 text-text-muted font-sans">Verificando conexión...</Text>
      </View>
    );
  }

  if (status === "offline") {
    return (
      <View className="absolute inset-0 z-50 w-full h-full justify-center items-center bg-background px-8">
        <View className="w-full p-6 bg-surface border border-border rounded-3xl items-center">
          <Text className="text-text text-xl font-lm-bold text-center mb-2">
            Sin conexión a Internet
          </Text>
          <Text className="text-text-muted font-sans text-center mb-6">
            Necesitas estar conectado para usar Transfer Cash.
          </Text>
          {checking ? (
            <ActivityIndicator color={colors.primary} size="large" className="mt-4" />
          ) : (
            <TouchableOpacity
              onPress={checkConnection}
              className="bg-primary px-6 py-3 rounded-xl"
            >
              <Text className="text-text font-lm-bold text-center">Reintentar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  if (status === "unstable") {
    return (
      <View style={{ flex: 1 }}>
        {children}
        <View className="absolute bottom-0 left-0 right-0 bg-primary px-4 py-3">
          <Text className="text-text text-center font-lm-medium text-sm">
            Señal débil — las transferencias pueden fallar
          </Text>
        </View>
      </View>
    );
  }

  return children;
}
