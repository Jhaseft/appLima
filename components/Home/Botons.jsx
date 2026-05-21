import { View, Text, TouchableOpacity, Animated, Linking } from "react-native";
import { RefreshCw, CreditCard, MessageCircle } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useRef } from "react";

const buttons = [
  
  {
    label: "Cuentas Bancarias",
    route: "/Cuentas",
    Icon: CreditCard,
    bg: "bg-gray-100",
    color: "#1f2937",
  },
  {
    label: "Cambiar Soles",
    route: "/Cambiar",
    Icon: RefreshCw,
    bg: "bg-yellow-400",
    color: "#000000",
  },
  { 
    label: "Recibe Ayuda",
    route: "",
    Icon: MessageCircle,
    bg: "bg-green-50",
    color: "#16A34A",
    whatsappMessage: "Hola, necesito ayuda con mis transferencias",
    whatsappNumber: "59160759245",
  },
];

export default function Botons() {
  const router = useRouter();

  const navigateTo = (btn) => {
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
              className={`w-28 h-28 rounded-2xl items-center justify-center ${btn.bg}`}
            >
              <btn.Icon size={32} color={btn.color} />
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
