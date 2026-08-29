import { useState } from "react";
import {
  Pressable,
  Alert,
  View,
  Text,
  Image,
  ActivityIndicator,
} from "react-native";
import miLogo from "../../assets/images/Logo_web_03.png";
import { Stack, useRouter, usePathname } from "expo-router";

import { Menu } from "lucide-react-native";
import { apiFetch } from "../services/apiFetch";
import { useUser } from "../ContextUser/UserContext";
import { useTcPuntos } from "../TcPuntos/TcPuntosContext";
import DrawerMenu from "../UserDropdown/DrawerMenu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TcPuntoIcon from "../TcPuntos/TcPuntoIcon";

// Rutas donde NO aparece el badge de TC Puntos
const RUTAS_SIN_TC_PUNTOS = [
  "/TcPuntos",
  "/MiCuenta",
  "/Cuentas",
  "/TransfersHistory",
  "/Politicas",
  "/PreguntasFrecuentes",
];

export default function HeaderUser({ title, subtitle, image }) {
  const { user, setUser, loading } = useUser();
  const { balance: tcBalance } = useTcPuntos();

  const [drawerVisible, setDrawerVisible] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const mostrarTcPuntos = !RUTAS_SIN_TC_PUNTOS.includes(pathname);

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      await apiFetch(`${API_BASE_URL}/api/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      //  Limpiar todo el AsyncStorage
      await AsyncStorage.clear();
      setUser(null);

      router.replace("/"); // redirige al login
    } catch (err) {
      console.log("Error en logout:", err);
      Alert.alert("Error", "No se pudo cerrar la sesión");
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View className="items-center justify-center">
              {image ? (
                <Image
                  source={miLogo}
                  style={{ width: 190, height: 50, resizeMode: "contain" }}
                />
              ) : (
                <>
                  <Text className="text-black text-2xl font-bold">
                    {loading ? "Cargando..." : title}
                  </Text>

                  {!!subtitle && (
                    <Text className="text-yellow-500 text-xs font-semibold">
                      {subtitle}
                    </Text>
                  )}
                </>
              )}
            </View>
          ),

          headerTitleAlign: "center",

          headerLeft: () => (
            <Pressable
              onPress={() => setDrawerVisible(true)}
              className="ml-[5px]"
              hitSlop={8}
            >
              <Menu size={26} color="#000" />
            </Pressable>
          ),

          headerRight: mostrarTcPuntos
            ? () => (
                <Pressable
                  onPress={() => router.push("/TcPuntos")}
                  className=" flex-row items-center"
                  hitSlop={8}
                >
                  <TcPuntoIcon size={26} />
                  {tcBalance !== null ? (
                    <Text className="text-sm font-bold text-yellow-500">
                      {tcBalance}
                    </Text>
                  ) : (
                    <ActivityIndicator size="small" color="#eab308" />
                  )}
                </Pressable>
              )
            : undefined,
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
