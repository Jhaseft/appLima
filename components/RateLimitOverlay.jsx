import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Clock, MessageCircle, Ban } from "lucide-react-native";
import { colors } from "../theme/colors";
import { subscribe, getState, clearBlock } from "./services/rateLimitStore";
import { useUser } from "./ContextUser/UserContext";

const ADMIN_WHATSAPP = "59163892482";
const ADMIN_MENSAJE = "Hola, mi cuenta está bloqueada en la app. ¿Me pueden ayudar?";

const dosDigitos = (n) => String(n).padStart(2, "0");

const hablarConAdmin = () =>
  Linking.openURL(`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(ADMIN_MENSAJE)}`);

export default function RateLimitOverlay() {
  const [state, setState] = useState(getState());
  const [now, setNow] = useState(Date.now());
  const router = useRouter();
  const { setUser } = useUser();

  useEffect(() => subscribe(setState), []);

  useEffect(() => {
    if (state.permanent || !state.until) return;
    const tick = () => {
      setNow(Date.now());
      if (Date.now() >= state.until) clearBlock();
    };
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [state.until, state.permanent]);

  const cerrarSesion = async () => {
    await AsyncStorage.multiRemove(["token", "user"]);
    setUser?.(null);
    clearBlock();
    router.replace("/");
  };

  if (state.permanent) {
    return (
      <View
        className="absolute inset-0 bg-background items-center justify-center px-10"
        style={{ elevation: 2000, zIndex: 9999 }}
      >
        <View className="w-20 h-20 rounded-full bg-primary-light items-center justify-center mb-6">
          <Ban size={40} color={colors.danger} />
        </View>

        <Text className="text-text text-xl font-lm-bold text-center">Cuenta bloqueada</Text>
        <Text className="text-text-muted font-sans text-center mt-2 leading-relaxed">
          {state.message || "Tu cuenta ha sido bloqueada."} Comunícate con el administrador para más información.
        </Text>

        <View className="w-full mt-10 gap-3">
          <TouchableOpacity
            onPress={hablarConAdmin}
            className="flex-row items-center justify-center gap-2 bg-primary py-3.5 rounded-2xl"
          >
            <MessageCircle size={18} color={colors.text} />
            <Text className="text-text font-lm-bold text-base">Hablar con el administrador</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={cerrarSesion} className="border border-border py-3.5 rounded-2xl">
            <Text className="text-text font-lm-medium text-base text-center">Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const restante = Math.max(0, Math.ceil((state.until - now) / 1000));
  if (restante <= 0) return null;

  const mm = dosDigitos(Math.floor(restante / 60));
  const ss = dosDigitos(restante % 60);

  return (
    <View
      className="absolute inset-0 bg-background items-center justify-center px-10"
      style={{ elevation: 2000, zIndex: 9999 }}
    >
      <View className="w-20 h-20 rounded-full bg-primary-light items-center justify-center mb-6">
        <Clock size={40} color={colors.primaryDark} />
      </View>

      <Text className="text-text text-xl font-lm-bold text-center">Bloqueado temporalmente</Text>
      <Text className="text-text-muted font-sans text-center mt-2 leading-relaxed">
        {state.message || "Realizaste demasiadas acciones seguidas."} Si crees que es un error, contacta al administrador.
      </Text>

      <Text className="text-primary-dark text-4xl font-lm-bold mt-8">{mm}:{ss}</Text>
      <Text className="text-text-muted font-sans text-xs mt-1">Podrás continuar cuando termine el tiempo</Text>

      <View className="w-full mt-10 gap-3">
        <TouchableOpacity
          onPress={hablarConAdmin}
          className="flex-row items-center justify-center gap-2 bg-primary py-3.5 rounded-2xl"
        >
          <MessageCircle size={18} color={colors.text} />
          <Text className="text-text font-lm-bold text-base">Hablar con el administrador</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={clearBlock} className="border border-border py-3.5 rounded-2xl">
          <Text className="text-text font-lm-medium text-base text-center">Entendido</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
