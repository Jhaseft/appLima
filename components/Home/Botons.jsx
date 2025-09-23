// Botons.jsx
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { FontAwesome5, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef } from "react";

// Iconos como componentes para evitar warnings
const RepeatIcon = (props) => (
  <FontAwesome5
    name="sync"
    {...props}
    solid={false}          // false = no sólido, líneas más delgadas
    color="#341BDE"        // azul más apagado (puedes ajustar #3B82F6 a otro tono)
    size={28}              // un poco más pequeño
  />
);
const CreditCardIcon = (props) => <MaterialIcons name="credit-card" {...props} />;

const buttons = [
  {
    label: "Cambiar Soles",
    route: "/Cambiar",
    iconType: "fa5",
    icon: RepeatIcon,
    colors: { icon: "" }, // azul apagado
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
    route: "/RecibeAyuda",
    iconType: "fa",
    icon: "whatsapp",
    colors: { icon: "#16A34A" },
  },
];

export default function Botons() {
  const router = useRouter();

  const navigateTo = (route) => router.replace(route);

  return (
    <View className="flex-row justify-between mt-4">
      {buttons.map((btn, index) => {
        const scaleAnim = useRef(new Animated.Value(1)).current;

        const handlePressIn = () => {
          Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
          }).start();
        };

        const handlePressOut = () => {
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
          }).start();
        };

        return (
          <Animated.View
            key={index}
            style={{ transform: [{ scale: scaleAnim }] }}
          >
            <TouchableOpacity
              onPress={() => navigateTo(btn.route)}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              className="w-28 h-28 rounded-xl items-center justify-center border"
            >
              {/* Icono */}
              {btn.iconType === "fa" ? (
                <FontAwesome
                  name={btn.icon}
                  size={32}
                  color={btn.colors.icon}
                />
              ) : (
                btn.icon && <btn.icon size={32} color={btn.colors.icon} />
              )}

              {/* Texto */}
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
