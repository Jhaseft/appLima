import { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import * as Network from "expo-network";
import * as Updates from "expo-updates";

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

      if (wasDisconnected.current && !isUnstable) {
        await Updates.reloadAsync();
      }

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

    // Reacciona inmediatamente cuando el sistema detecta cambio de red
    const subscription = Network.addNetworkStateListener((state) => {
      const connected = state.isConnected && state.isInternetReachable;
      if (!connected) {
        wasDisconnected.current = true;
        applyStatus("offline");
      } else if (statusRef.current === "offline") {
        // Volvió la señal — verificar latencia antes de marcar como online
        checkConnection();
      }
    });

    // Chequeo de latencia cada 20s para detectar señal pobre
    const latencyInterval = setInterval(async () => {
      if (statusRef.current === "offline") return;
      const latency = await measureLatency();
      if (latency === null) {
        wasDisconnected.current = true;
        applyStatus("offline");
      } else if (latency > LATENCY_WARNING_MS) {
        applyStatus("unstable");
      } else if (statusRef.current === "unstable") {
        applyStatus("online");
      }
    }, 20000);

    return () => {
      subscription.remove();
      clearInterval(latencyInterval);
    };
  }, []);

  if (status === "checking") {
    return (
      <View className="absolute inset-0 z-50 w-full h-full justify-center items-center bg-white">
        <ActivityIndicator color="#000" size="large" />
        <Text className="mt-4 text-gray-500">Verificando conexión...</Text>
      </View>
    );
  }

  if (status === "offline") {
    return (
      <View className="absolute inset-0 z-50 w-full h-full justify-center items-center bg-white">
        <View className="w-4/5 p-6 bg-white rounded-xl shadow-lg items-center">
          <Text className="text-black text-xl font-bold text-center mb-2">
            Sin conexión a Internet
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            Necesitas estar conectado para usar Transfer Cash.
          </Text>
          {checking ? (
            <ActivityIndicator color="#000" size="large" className="mt-4" />
          ) : (
            <TouchableOpacity
              onPress={checkConnection}
              className="bg-blue-500 px-6 py-3 rounded-lg"
            >
              <Text className="text-white font-bold text-center">Reintentar</Text>
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
        <View className="absolute bottom-0 left-0 right-0 bg-yellow-500 px-4 py-3">
          <Text className="text-white text-center font-semibold text-sm">
            Señal débil — las transferencias pueden fallar
          </Text>
        </View>
      </View>
    );
  }

  return children;
}
