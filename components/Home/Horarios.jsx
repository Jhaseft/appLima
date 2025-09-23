import { View, Text } from "react-native";

export default function Horarios() {
  const horarios = [
    { dia: "Lunes - Viernes", hora: "09:00 AM - 18:00 PM" },
    { dia: "Sábados", hora: "09:00 AM - 13:00 PM" },
    { dia: "Domingos", hora: "Cerrado" },
  ];

  return (
    <View className="mt-10 bg-indigo-50 rounded-2xl p-5 shadow-md">
      <Text className="text-xl font-bold text-indigo-700 text-center mb-4">
        Horarios de Atención
      </Text>
      {horarios.map((item, i) => (
        <View
          key={i}
          className="flex-row justify-between border-b border-indigo-200 py-2"
        >
          <Text className="text-base font-semibold text-gray-700">{item.dia}</Text>
          <Text className="text-base text-gray-600">{item.hora}</Text>
        </View>
      ))}
      <Text className="text-sm text-gray-500 text-center mt-3">
        📍 Atención en sucursal central · Cochabamba, Bolivia
      </Text>
    </View>
  );
}
