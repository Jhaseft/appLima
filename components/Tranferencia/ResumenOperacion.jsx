import { View, Text } from "react-native";

export default function ResumenOperacion({ operacion, isOriginBank, tasa, conversion }) {
  return (
    <View className="border border-border rounded-lg bg-surface p-3 mb-4">
      <Text className="text-text">
        <Text className="font-lm-bold">Monto: </Text>
        {operacion.monto} {isOriginBank ? "PEN" : "BOB"}
      </Text>
      <Text className="text-text">
        <Text className="font-lm-bold">Conversión: </Text>
        {conversion} {isOriginBank ? "BOB" : "PEN"}
      </Text>
      <Text className="text-text">
        <Text className="font-lm-bold">Tasa: </Text>
        {tasa}
      </Text>
    </View>
  );
}
