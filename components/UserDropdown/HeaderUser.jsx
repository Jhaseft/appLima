import { useRef, useState } from "react";
import {
  Pressable,
  View,
  Text,
  Image,
  Platform,
  useWindowDimensions,
} from "react-native";
import { colors } from "../../theme/colors";
import { useFeedback } from "../Feedback/FeedbackContext";
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
  "/PreguntasFrecuentes",
  "/Idioma",
];

export default function HeaderUser({ title, subtitle, image }) {
  const { user, setUser, loading } = useUser();
  const { balance: tcBalance } = useTcPuntos();
  const feedback = useFeedback();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [origin, setOrigin] = useState(null);
  const iconRef = useRef(null);

  const router = useRouter();
  const pathname = usePathname();
  const mostrarTcPuntos = !RUTAS_SIN_TC_PUNTOS.includes(pathname);

  const { width } = useWindowDimensions();
  const titleMaxWidth = Math.max(160, width - 120);
  const logoWidth = Math.min(190, titleMaxWidth);

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
      feedback.error("No se pudo cerrar la sesión");
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View className="items-center justify-center" style={{ maxWidth: titleMaxWidth }}>
              {image ? (
                <Image
                  source={miLogo}
                  style={{ width: logoWidth, height: 50, resizeMode: "contain" }}
                />
              ) : (
                <>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.7}
                    className="text-text text-2xl font-lm-bold text-center"
                  >
                    {loading ? "Cargando..." : title}
                  </Text>

                  {!!subtitle && (
                    <Text
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.8}
                      className="text-primary-accent text-xs font-lm-medium text-center"
                    >
                      {subtitle}
                    </Text>
                  )}
                </>
              )}
            </View>
          ),

          headerTitleAlign: "center",
          headerTitleContainerStyle: { maxWidth: titleMaxWidth, alignItems: "center" },
          headerLeftContainerStyle: { paddingLeft: 12 },
          headerRightContainerStyle: { paddingRight: 12 },

          headerLeft: () => (
            <Pressable className="ml-[4px]" onPress={openMenu} hitSlop={8}>
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
                  className="flex-row items-center gap-1"
                  hitSlop={8}
                >
                  <TcPuntoIcon size={24} />
                  {tcBalance !== null && (
                    <Text className="text-sm font-lm-bold text-primary-accent">
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
