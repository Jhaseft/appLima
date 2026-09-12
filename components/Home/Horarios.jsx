import { View, Text } from "react-native";
import { HORARIOS } from "../api";

export default function Horarios() {
  return (
    <View className="mt-6 mb-4 bg-surface rounded-3xl p-5">
      <Text className="text-xs text-primary-dark font-lm-medium uppercase mb-1">Atención</Text>
      <Text className="text-lg font-lm-bold text-text mb-4">Horarios</Text>
      {HORARIOS.map((item, i) => (
        <View
          key={i}
          className={`flex-row justify-between py-3 ${i < HORARIOS.length - 1 ? "border-b border-border" : ""}`}
        >
          <Text className="text-sm font-lm-medium text-text">{item.dia}</Text>
          <Text className={`text-sm font-sans ${item.hora === "Cerrado" ? "text-danger" : "text-text-muted"}`}>{item.hora}</Text>
        </View>
      ))}
      <Text className="text-xs text-text-muted text-center mt-3 font-sans">Sucursal central · Cochabamba, Bolivia</Text>
    </View>
  );
}
