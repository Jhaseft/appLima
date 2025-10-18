import "../global.css";
import { Stack } from "expo-router";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UserProvider } from "../components/ContextUser/UserContext";
import { StatusBar } from "expo-status-bar";
import * as Network from "expo-network";
import { useState, useEffect } from "react";
import * as Updates from "expo-updates"; // 👈 para recargar app si quieres

export default function Layout() {
  const insets = useSafeAreaInsets();
  const [networkModal, setNetworkModal] = useState(false);

  useEffect(() => {
    const subscribe = Network.addNetworkStateListener((status) => {
      if (!status.isConnected) {
        setNetworkModal(true);
      } else {
        setNetworkModal(false);

        // 👇 si quieres recargar TODA la app al volver internet:
        Updates.reloadAsync();
      }
    });

    return () => {
      subscribe.remove();
    };
  }, []);

  return (
    <UserProvider>
      <View className="flex-1" style={{ paddingBottom: insets.bottom }}>
        <StatusBar style="dark" />
        <Stack />
        <Modal transparent visible={networkModal} animationType="fade">
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-6 rounded-xl w-80 items-center">
              <Text className="text-black text-center mb-4">
                Sin conexión a Internet
              </Text>
              <Text className="text-gray-600 text-center mb-6">
                Necesitas estar conectado a internet para usar Transfer Cash.
              </Text>
              <TouchableOpacity
                onPress={() => Updates.reloadAsync()} // 👈 fuerza recarga
                className="bg-blue-500 px-6 py-3 rounded-lg"
              >
                <Text className="text-white font-bold text-center">
                  Reintentar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </UserProvider>
  );
}
