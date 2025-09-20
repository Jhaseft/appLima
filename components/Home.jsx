import { useEffect, useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, Stack } from "expo-router";

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // ✅ Obtener la info del usuario desde el backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          router.replace("/"); // si no hay token, volver al login
          return;
        }

        const res = await fetch("https://panel.transfercash.click/api/userapp", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("No autorizado");
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.log("Error obteniendo usuario:", err);
        Alert.alert("Error", "No se pudo obtener la información del usuario");
      }
    };

    fetchUser();
  }, []);

  // ✅ Logout
  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      await fetch("https://panel.transfercash.click/api/logoutapp", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");

      router.replace("/"); // volver al login
    } catch (err) {
      console.log("Error en logout:", err);
      Alert.alert("Error", "No se pudo cerrar la sesión");
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">

      <Stack.Screen
        options={{
          headerShown: true,              // Mostrar el header
          headerTitle: "Transfer Cash",   // Título del header
          headerTitleAlign: "center",     // Centrar el título
          headerTintColor: "black",       // Color del texto
          headerStyle: { backgroundColor: "white" }, // Fondo negro
          headerBackVisible: false,       // Oculta la flecha hacia atrás
          gestureEnabled: false,          // Desactiva el gesto de deslizar hacia atrás (iOS)
        }}
      />
      <Text className="text-2xl font-bold text-black mb-4">
        Página autenticada 
      </Text>

      {user ? (
        <View className="items-center mb-6">
          <Text className="text-lg text-black">👤 {user.first_name}</Text>
          <Text className="text-lg text-black">📧 {user.email}</Text>
        </View>
      ) : (
        <Text className="text-black">Cargando información...</Text>
      )}

      <Pressable
        onPress={handleLogout}
        className="bg-red-500 px-6 py-3 rounded-2xl shadow-lg active:opacity-70"
      >
        <Text className="text-white font-bold text-lg">Cerrar sesión</Text>
      </Pressable>
    </View>
  );
}
