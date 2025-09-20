import { Link, Stack, useRouter } from "expo-router";
import "../global.css";
import { View, Text, Pressable, Image, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Inicio() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        // Si existe token, ir a Home (replace para que no pueda volver a Inicio con "back")
        if (token) {
          router.replace("/Home");
        } else {
          if (mounted) setLoading(false);
        }
      } catch (err) {
        console.log("Error revisando sesión:", err);
        if (mounted) setLoading(false);
      }
    };

    checkAuth();
    return () => {
      mounted = false;
    };
  }, [router]);

  // Mientras comprobaremos sesión mostramos un spinner
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-6">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Logo */}
      <View className="flex-1 items-center justify-center">
        <Image
          source={{
            uri: "https://res.cloudinary.com/dnbklbswg/image/upload/v1756305635/logo_n6nqqr.jpg",
          }}
          className="w-64 h-64"
          resizeMode="contain"
        />
        <Text className="text-2xl font-extrabold text-black mt-4">
          Bienvenido A Transfer Cash
        </Text>
        <Text className="text-base text-black font-semibold mt-1">
          Cambios rapidos y seguros
        </Text>
      </View>

      {/* Botones */}
      <View className="mb-2">
        <Text className="text-black text-center font-bold text-lg">
          Para iniciar tu operacion
        </Text>

        <Link asChild href="/Register">
          <Pressable className="mt-4 border-2 border-black py-4 rounded-2xl active:opacity-70">
            <Text className="text-black text-center font-bold text-lg">
              ¡Registrate!
            </Text>
          </Pressable>
        </Link>

        <Link asChild href="/Login">
          <Pressable className="bg-black  py-4 mt-4 rounded-2xl active:opacity-80 shadow-lg">
            <Text className="text-white text-center font-bold text-lg">
              Iniciar Sesión
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
