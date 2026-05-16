import { View, Text } from "react-native";
import { HORARIOS } from "../api";

export default function Horarios() {
  const horarios = HORARIOS;

  return (
    <View className="mt-6 mb-4 bg-indigo-50 rounded-3xl p-5">
      <Text className="text-xs text-indigo-400 font-semibold uppercase mb-1">Atención</Text>
      <Text className="text-lg font-bold text-indigo-800 mb-4">Horarios</Text>
      {horarios.map((item, i) => (
        <View
          key={i}
          className={`flex-row justify-between py-3 ${i < horarios.length - 1 ? "border-b border-indigo-100" : ""}`}
        >
          <Text className="text-sm font-semibold text-gray-700">{item.dia}</Text>
          <Text className={`text-sm font-medium ${item.hora === "Cerrado" ? "text-red-400" : "text-indigo-600"}`}>{item.hora}</Text>
        </View>
      ))}
      <Text className="text-xs text-gray-400 text-center mt-3">Sucursal central · Cochabamba, Bolivia</Text>
    </View>
  );
}
