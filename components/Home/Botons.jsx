import { View, Text, TouchableOpacity, Animated, Linking } from "react-native";
import { FontAwesome5, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef } from "react";

// Iconos como componentes
const RepeatIcon = (props) => (
  <FontAwesome5 name="sync" {...props} solid={false} color="#341BDE" size={28} />
);
const CreditCardIcon = (props) => <MaterialIcons name="credit-card" {...props} />;

const buttons = [
  {
    label: "Cambiar Soles",
    route: "/Cambiar",
    iconType: "fa5",
    icon: RepeatIcon,
    colors: { icon: "" },
  },
  {
    label: "Cuentas Bancarias",
    route: "/Cuentas",
    iconType: "material",
    icon: CreditCardIcon,
    colors: { icon: "#000000" },
  },
  {
    label: "Recibe Ayuda",
    route: "", // No hace navegación interna
    iconType: "fa",
    icon: "whatsapp",
    colors: { icon: "#16A34A" },
    whatsappMessage: "Hola, necesito ayuda con mis transferencias",
    whatsappNumber: "59165359695", // tu número con código de país
  },
];

export default function Botons() {
  const router = useRouter();

  const navigateTo = (btn) => {
    // Si tiene número de WhatsApp, abrir WhatsApp
    if (btn.whatsappNumber) {
      const url = `https://wa.me/${btn.whatsappNumber}?text=${encodeURIComponent(
        btn.whatsappMessage
      )}`;
      Linking.openURL(url);
    } else {
      router.replace(btn.route);
    }
  };

  return (
    <View className="flex-row justify-between mt-4">
      {buttons.map((btn, index) => {
        const scaleAnim = useRef(new Animated.Value(1)).current;

        const handlePressIn = () => {
          Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
        };

        const handlePressOut = () => {
          Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }).start();
        };

        return (
          <Animated.View key={index} style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              onPress={() => navigateTo(btn)}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              className="w-28 h-28 rounded-xl items-center justify-center border"
            >
              {btn.iconType === "fa" ? (
                <FontAwesome name={btn.icon} size={32} color={btn.colors.icon} />
              ) : (
                btn.icon && <btn.icon size={32} color={btn.colors.icon} />
              )}
              <Text className="mt-2 text-sm font-medium text-gray-800 text-center">
                {btn.label}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
}
