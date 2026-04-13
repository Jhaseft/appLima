import { View, Text, TouchableOpacity } from "react-native";

export default function MetodoPago({ onNext, onBack, operacion, setOperacion }) {
  const handleSelect = (metodo) => {
    setOperacion((prev) => ({ ...prev, metodo }));
    onNext(metodo);
  };

  return (
    <View className="flex-1 bg-white px-6 py-6">
      <Text className="text-xl font-bold text-black text-center mb-2">
        ¿Cómo deseas operar?
      </Text>
      <Text className="text-gray-500 text-sm text-center mb-8">
        Selecciona el método de pago para tu operación
      </Text>

      <TouchableOpacity
        onPress={() => handleSelect("transferencia")}
        className="w-full py-4 rounded-2xl bg-yellow-400 mb-4 shadow"
      >
        <Text className="text-black font-bold text-center text-base">
          🏦 Transferencia Bancaria
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleSelect("qr")}
        className="w-full py-4 rounded-2xl border-2 border-yellow-400 mb-4"
      >
        <Text className="text-yellow-600 font-bold text-center text-base">
          📷 Pago por QR
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleSelect("efectivo")}
        className="w-full py-4 rounded-2xl border-2 border-gray-300 mb-4"
      >
        <Text className="text-gray-600 font-bold text-center text-base">
          💵 Efectivo
        </Text>
      </TouchableOpacity>

      <View className="flex-row justify-start mt-6">
        <TouchableOpacity onPress={onBack} className="bg-gray-300 px-6 py-3 rounded-lg">
          <Text className="text-black font-semibold">Atrás</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
