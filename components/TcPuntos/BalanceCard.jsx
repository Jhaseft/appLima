import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../theme/colors";
import TcPuntoIcon from "./TcPuntoIcon";

export default function BalanceCard({ balance, valorPunto, moneda = "S/", onInfoPress }) {
  const router = useRouter();
  return (
    <View className="items-center pt-8 pb-6 px-6 bg-background border-b border-border">
      <View className="flex-row gap-3 mb-5 self-center">
        <Pressable
          onPress={onInfoPress}
          className="flex-row items-center gap-2 bg-primary active:bg-primary-accent rounded-2xl px-4 py-3"
          style={{
            shadowColor: colors.primaryDark,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 6,
            elevation: 5,
          }}
        >
          <View className="bg-black/10 rounded-full w-5 h-5 items-center justify-center">
            <Text className="text-text text-xs font-lm-bold leading-none">?</Text>
          </View>
          <Text className="text-text font-lm-bold text-sm">¿Cómo funciona?</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/TcPuntosHistorial")}
          className="flex-row items-center gap-2 bg-text active:opacity-80 rounded-2xl px-4 py-3"
          style={{
            shadowColor: colors.text,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 5,
          }}
        >
          <View className="bg-white/10 rounded-full w-5 h-5 items-center justify-center">
            <Text className="text-background text-xs font-lm-bold leading-none">☰</Text>
          </View>
          <Text className="text-background font-lm-bold text-sm">Historial de puntos</Text>
        </Pressable>
      </View>

      <View className="flex-row gap-4 mb-2">
        <TcPuntoIcon size={72} />
        <Text className="text-5xl font-lm-bold text-text mt-4">
          {balance !== null ? Number(balance).toLocaleString(undefined, { maximumFractionDigits: 2 }) : "0"} pts
        </Text>
      </View>

      {valorPunto !== null && (
        <View className="mt-3 bg-primary-light border border-primary-accent rounded-2xl px-5 py-1.5">
          <Text className="text-primary-dark text-xs font-lm-medium">
            1 TC Punto = {moneda} {Number(valorPunto).toFixed(2)}
          </Text>
        </View>
      )}
    </View>
  );
}
