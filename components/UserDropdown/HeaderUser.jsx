import { useState } from "react";
import {
  Pressable,
  Alert,
  View,
  Text,
} from "react-native";

import { Stack, useRouter } from "expo-router";

import { Menu } from "lucide-react-native";

import { useUser } from "../ContextUser/UserContext";

import DrawerMenu from "../UserDropdown/DrawerMenu";

import AsyncStorage from "@react-native-async-storage/async-storage";

import API_BASE_URL from "../api";

export default function HeaderUser({ title, subtitle }) {
  const { user, setUser, loading } = useUser();

  const [drawerVisible, setDrawerVisible] = useState(false);

  const router = useRouter();

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) return;

      await fetch(`${API_BASE_URL}/api/logoutapp`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await AsyncStorage.clear();

      setUser(null);

      router.replace("/");
    } catch (err) {
      console.log("Error en logout:", err);

      Alert.alert("Error", "No se pudo cerrar la sesión");
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerBackVisible: false,

          gestureEnabled: false,

          headerShadowVisible: true,

          headerStyle: {
            backgroundColor: "white",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 6,
            elevation: 4,
          },

          headerLeft: () => (
            <Pressable
              onPress={() => !loading && setDrawerVisible(true)}
              className="ml-3 p-2"
              hitSlop={8}
            >
              <Menu size={26} color="black" />
            </Pressable>
          ),

          headerTitle: () => (
            <View className="items-center justify-center">
              <Text className="text-black text-2xl font-bold">
                {loading ? "Cargando..." : title}
              </Text>

              {!!subtitle && (
                <Text className="text-yellow-500 text-xs font-semibold">
                  {subtitle}
                </Text>
              )}
            </View>
          ),

          headerTitleAlign: "center",
        }}
      />

      <DrawerMenu
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        user={user}
        onLogout={handleLogout}
        router={router}
      />
    </>
  );
}
