import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import TcPuntoIcon from "./TcPuntoIcon";

export default function BalanceCard({ balance, valorPunto, onInfoPress }) {
  const router = useRouter();
  return (
    <View className="items-center pt-8 pb-6 px-6 bg-white border-b border-gray-100">
      <View className="flex-row gap-3 mb-5 self-center">
        <Pressable
          onPress={onInfoPress}
          className="flex-row items-center gap-2 bg-yellow-400 active:bg-yellow-500 rounded-2xl px-4 py-3"
          style={{
            shadowColor: "#f59e0b",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 6,
            elevation: 5,
          }}
        >
          <View className="bg-black/10 rounded-full w-5 h-5 items-center justify-center">
            <Text className="text-black text-xs font-bold leading-none">?</Text>
          </View>
          <Text className="text-black font-bold text-sm">¿Cómo funciona?</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/TcPuntosHistorial")}
          className="flex-row items-center gap-2 bg-black active:bg-gray-800 rounded-2xl px-4 py-3"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 5,
          }}
        >
          <View className="bg-black/10 rounded-full w-5 h-5 items-center justify-center">
            <Text className="text-white text-xs font-bold leading-none">☰</Text>
          </View>
          <Text className="text-white font-bold text-sm">Historial de puntos</Text>
        </Pressable>
      </View>

      <View className="flex-row gap-4 mb-2">
        <TcPuntoIcon size={72} />
        <Text className="text-5xl font-bold text-black mt-4">
          {balance !== null ? balance : "0"} pts
        </Text>
      </View>

      {valorPunto !== null && (
        <View className="mt-3 bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-1.5">
          <Text className="text-yellow-700 text-xs font-semibold">
            1 TC Punto = S/ {Number(valorPunto).toFixed(2)}
          </Text>
        </View>
      )}
    </View>
  );
}
