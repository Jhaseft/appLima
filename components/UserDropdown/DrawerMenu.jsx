import { useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePathname } from "expo-router";
import {
  House,
  CreditCard,
  RefreshCcw,
  MessageCircle,
  Coins,
  FileText,
  HelpCircle,
  LogOut,
  ClipboardList,
  UserCircle,
} from "lucide-react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const DRAWER_WIDTH = Dimensions.get("window").width * 0.75;

const NAV_ITEMS = [
  { label: "Inicio", icon: House, route: "/Home" },
  { label: "Cuentas", icon: CreditCard, route: "/Cuentas" },
  { label: "Cambiar", icon: RefreshCcw, route: "/Cambiar" },
  { label: "Chat", icon: MessageCircle, route: "/Chat" },
  { label: "TcPuntos", icon: Coins, route: "/TcPuntos" },
  { label: "Ver Operaciones", icon: ClipboardList, route: "/TransfersHistory" },
];

const INFO_ITEMS = [
  { label: "Políticas", icon: FileText, route: "/Politicas" },
  { label: "Preguntas frecuentes", icon: HelpCircle, route: "/PreguntasFrecuentes" },
];

const REDES = [
  { icon: "instagram", color: "#E1306C", url: "https://www.instagram.com/transfercash.pe/" },
  { icon: "facebook", color: "#1877F2", url: "https://www.facebook.com/people/TransferCash/61577711887086/" },
  { icon: "tiktok", color: "#010101", url: "https://www.tiktok.com/@transfercash.pe?_r=1&_t=ZS-94y1kvv5wzU" },
];

function Avatar({ user }) {
  const initials = user
    ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase()
    : "?";
  return (
    <View className="w-14 h-14 rounded-full bg-yellow-400 items-center justify-center mb-3 border-2 border-black">
      <Text className="text-black text-xl font-bold">{initials}</Text>
    </View>
  );
}

function Divider() {
  return <View className="h-px bg-gray-200 my-2 mx-4" />;
}

function NavItem({ label, icon: Icon, route, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center px-5 py-3 mx-2 rounded-xl mb-1 ${active ? "bg-yellow-400" : ""
        }`}
    >
      <Icon size={20} color={active ? "#000" : "#374151"} />
      <Text
        className={`ml-3 text-base font-medium ${active ? "text-black font-bold" : "text-gray-700"
          }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function DrawerMenu({ visible, onClose, user, onLogout, router }) {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 12,
      }).start();
    } else {
      Animated.timing(translateX, {
        toValue: -DRAWER_WIDTH,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const navigate = (route) => {
    onClose();
    if (route !== pathname) {
      setTimeout(() => router.replace(route), 100);
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, flexDirection: "row" }}>
        <Animated.View
          style={{
            width: DRAWER_WIDTH,
            transform: [{ translateX }],
            backgroundColor: "white",
            shadowColor: "#000",
            shadowOpacity: 0.25,
            shadowRadius: 12,
            elevation: 8,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          }}
        >

          <View className="px-5 pt-5 pb-2 bg-white">
            {user ? (
              <>

                <View className="flex-row items-center">
                  <Avatar user={user} />

                  <View className="ml-4 flex-1 mb-3">
                    <Text className="text-black text-lg font-bold">
                      {user.first_name} {user.last_name}
                    </Text>

                    <Text className="text-yellow-500 text-sm font-medium mt-0.5">
                      {user.email}
                    </Text>
                  </View>
                </View>

                <Pressable
                  onPress={() => navigate("/MiCuenta")}
                  className="mt-2 flex-row items-center justify-center rounded-2xl border-2 border-black py-2.5 px-4  "
                >
                  <UserCircle size={17} color="black" />

                  <Text className="ml-2 text-black font-bold text-sm">
                    Ver mi cuenta
                  </Text>
                </Pressable>
              </>
            ) : (
              <Text className="text-gray-400">
                Cargando...
              </Text>
            )}
          </View>

          <Divider />


          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 4 }}
          >
            {NAV_ITEMS.map((item) => (
              <NavItem
                key={item.route}
                {...item}
                active={pathname === item.route}
                onPress={() => navigate(item.route)}
              />
            ))}

            <Divider />

            {INFO_ITEMS.map((item) => (
              <NavItem
                key={item.route}
                {...item}
                active={pathname === item.route}
                onPress={() => navigate(item.route)}
              />
            ))}
          </ScrollView>


          <View>

            <View className="flex-row justify-center gap-5 py-7">
              {REDES.map((red) => (
                <Pressable
                  key={red.icon}
                  onPress={() => Linking.openURL(red.url)}
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{ backgroundColor: red.color + "18" }}
                >
                  <FontAwesome5 name={red.icon} size={20} color={red.color} />
                </Pressable>
              ))}
            </View>

            <Divider />

            <Pressable
              onPress={() => {
                onClose();
                setTimeout(onLogout, 150);
              }}
              className="flex-row items-center px-5 py-3 mx-2 mb-2 rounded-xl border border-black"
            >
              <LogOut size={20} color="#000" />
              <Text className="ml-3 text-black font-bold text-base">
                Cerrar sesión
              </Text>
            </Pressable>
          </View>
        </Animated.View>

  
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
          activeOpacity={1}
          onPress={onClose}
        />
      </View>
    </Modal>
  );
}
