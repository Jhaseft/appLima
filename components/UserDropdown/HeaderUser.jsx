import { useRef, useState } from "react";
import {
  Pressable,
  Alert,
  View,
  Text,
  Image,
  Platform,
} from "react-native";
import { colors } from "../../theme/colors";
import miLogo from "../../assets/images/Logo_web_03.png";
import { Stack, useRouter, usePathname } from "expo-router";

import { Menu,User,UserRoundCog   } from "lucide-react-native";
import { apiFetch } from "../services/apiFetch";
import { useUser } from "../ContextUser/UserContext";
import { useTcPuntos } from "../TcPuntos/TcPuntosContext";
import DrawerMenu from "../UserDropdown/DrawerMenu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TcPuntoIcon from "../TcPuntos/TcPuntoIcon";
import API_BASE_URL from "../api";

// Rutas donde NO aparece el badge de TC Puntos
const RUTAS_SIN_TC_PUNTOS = [
  "/TcPuntos",
  "/MiCuenta",
  "/Cuentas",
  "/TransfersHistory",
  "/Politicas",
  "/PreguntasFrecuentes",
  "/Idioma",
];

export default function HeaderUser({ title, subtitle, image }) {
  const { user, setUser, loading } = useUser();
  const { balance: tcBalance } = useTcPuntos();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [origin, setOrigin] = useState(null);
  const iconRef = useRef(null);

  const router = useRouter();
  const pathname = usePathname();
  const mostrarTcPuntos = !RUTAS_SIN_TC_PUNTOS.includes(pathname);

  const CY_DIVISOR = Platform.OS === "ios" ? 2 : 0.64;

  const openMenu = () => {
    const node = iconRef.current;
    if (node?.measureInWindow) {
      node.measureInWindow((x, y, w, h) => {
        setOrigin({ cx: x + w / 2, cy: y + h / CY_DIVISOR });
        setDrawerVisible(true);
      });
    } else {
      setDrawerVisible(true);
    }
  };

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
                  <Text className="text-black text-2xl font-lm-bold">
                    {loading ? "Cargando..." : title}
                  </Text>

                  {!!subtitle && (
                    <Text className="text-yellow-500 text-xs font-lm-medium">
                      {subtitle}
                    </Text>
                  )}
                </>
              )}
            </View>
          ),

          headerTitleAlign: "center",
 
          headerLeft: () => (
            <Pressable onPress={openMenu} className="ml-[5px]" hitSlop={8}>
              <View
                ref={iconRef}
                collapsable={false}
                style={{ opacity: drawerVisible ? 0 : 1 }}
              >
                <UserRoundCog size={30} color={colors.text} />
              </View>
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
                  {tcBalance !== null && (
                    <Text className="text-sm font-lm-bold text-yellow-500">
                      {tcBalance}
                    </Text>
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
        origin={origin}
      />
    </>
  );
}
