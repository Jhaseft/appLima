import { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Dimensions } from "react-native";
import * as Network from "expo-network";
import * as Updates from "expo-updates";

const { width, height } = Dimensions.get("window");

export default function NetworkGuard({ children }) {
  const [isConnected, setIsConnected] = useState(null); // null = verificando
  const [checking, setChecking] = useState(false);
  const wasDisconnected = useRef(false);

  const checkConnection = async () => {
    setChecking(true);
    try {
      const state = await Network.getNetworkStateAsync();
      const connected = state.isConnected && state.isInternetReachable;

      if (wasDisconnected.current && connected) {
        await Updates.reloadAsync(); // recarga automática
      }

      wasDisconnected.current = !connected;
      setIsConnected(connected);
    } catch (error) {
      setIsConnected(false);
      wasDisconnected.current = true;
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 3000);
    return () => clearInterval(interval);
  }, []);

  // Pantalla bloqueante
  if (isConnected === false) {
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

  // Mientras se verifica la primera vez
  if (isConnected === null) {
    return (
      <View className="absolute inset-0 z-50 w-full h-full justify-center items-center bg-white">
        <ActivityIndicator color="#000" size="large" />
        <Text className="mt-4 text-gray-500">Verificando conexión...</Text>
      </View>
    );
  }

  // Si hay conexión, renderiza la app normal
  return children;
}
