import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Clock } from "lucide-react-native";
import { colors } from "../theme/colors";
import { subscribe, getState, clearBlock } from "./services/rateLimitStore";

const dosDigitos = (n) => String(n).padStart(2, "0");

export default function RateLimitOverlay() {
  const [state, setState] = useState(getState());
  const [now, setNow] = useState(Date.now());

  useEffect(() => subscribe(setState), []);

  useEffect(() => {
    if (!state.until) return;
    const tick = () => {
      setNow(Date.now());
      if (Date.now() >= state.until) clearBlock();
    };
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [state.until]);

  const restante = Math.max(0, Math.ceil((state.until - now) / 1000));
  if (restante <= 0) return null;

  const mm = dosDigitos(Math.floor(restante / 60));
  const ss = dosDigitos(restante % 60);

  return (
    <View className="absolute inset-0 z-50 bg-background items-center justify-center px-10">
      <View className="w-20 h-20 rounded-full bg-primary-light items-center justify-center mb-6">
        <Clock size={40} color={colors.primaryDark} />
      </View>

      <Text className="text-text text-xl font-lm-bold text-center">Demasiadas solicitudes</Text>
      <Text className="text-text-muted font-sans text-center mt-2 leading-relaxed">
        {state.message || "Estás realizando demasiadas acciones. Espera un momento antes de continuar."}
      </Text>

      <Text className="text-primary-dark text-4xl font-lm-bold mt-8">{mm}:{ss}</Text>
      <Text className="text-text-muted font-sans text-xs mt-1">Podrás continuar cuando termine el tiempo</Text>
    </View>
  );
}
