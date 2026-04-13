import { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Switch,ActivityIndicator } from "react-native";
import { Copy } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import { useTransferMethods } from "../hooks/useTransferMethods";
export default function Transfiere({ onNext, onBack, operacion, setOperacion }) {
  const [confirmado, setConfirmado] = useState(false);

  const { methods: opciones, loading: loadingMethods } = useTransferMethods(operacion.modo);

  const isBOBtoPEN = operacion.modo === "BOBtoPEN";

  const montoTexto = isBOBtoPEN ? `${operacion.monto} BOB` : `${operacion.monto} PEN`;
  const conversionTexto = isBOBtoPEN ? `${operacion.conversion} PEN` : `${operacion.conversion} BOB`;

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
  };

  return (
    <ScrollView className="flex-1 bg-white px-6 py-4">
      <Text className="text-xl font-bold text-black text-center mb-4">
        Realiza tu transferencia
      </Text>

     
      <View className="border rounded-lg bg-gray-50 p-4 mb-6">
        <Text className="text-black">
          <Text className="font-semibold">Conversión:</Text> {operacion.modo}
        </Text>
        <Text className="text-black">
          <Text className="font-semibold">Monto a enviar:</Text> {montoTexto}
        </Text>
        <Text className="text-black">
          <Text className="font-semibold">Monto a recibir:</Text> {conversionTexto}
        </Text>
        <Text className="text-black">
          <Text className="font-semibold">Tasa:</Text> {operacion.tasa}
        </Text>
      </View>


      <View className="gap-4">
        <Text className="text-black font-semibold mb-2">
          {isBOBtoPEN ? "Escanea el QR para transferir" : "Realiza el depósito a:"}
        </Text>
        {loadingMethods ? (
          <ActivityIndicator size="small" color="#000" />
        ) : opciones.length === 0 ? (
          <Text className="text-gray-400 text-sm text-center">Sin métodos disponibles</Text>
        ) : null}
        {opciones.map((op, idx) => {
          if (op.type === "qr") {
            return (
              <View key={idx} className="flex flex-col items-center gap-2 p-4 border rounded-lg bg-white shadow">
                <Text className="font-semibold text-black mb-2">Escanea el QR</Text>
                <Image source={{ uri: op.image }} className="w-60 h-60 resize-contain" />
              </View>
            );
          }

          return (
            <View key={idx} className="flex-row items-center gap-3 border rounded-lg p-3 bg-white shadow">
              <Image source={{ uri: op.image }} className="w-12 h-12 resize-contain" />
              <View className="flex-1">
                <Text className="font-bold text-black">{op.title}</Text>
                <Text className="text-gray-700">Número: {op.number}</Text>
              </View>
              <TouchableOpacity onPress={() => copyToClipboard(op.number)}>
                <Copy size={20} color="black" />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

     
      <View className="flex-row items-center justify-between mt-6 px-2">
        <Text className="text-black font-medium">Ya envié el dinero</Text>
        <Switch value={confirmado} onValueChange={setConfirmado} />
      </View>

     
      <View className="flex-row justify-between mt-10">
        <TouchableOpacity onPress={onBack} className="bg-gray-300 px-6 py-3 rounded-lg">
          <Text className="text-black font-semibold">Atrás</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!confirmado}
          onPress={onNext}
          className={`px-6 py-3 rounded-lg ${confirmado ? "bg-yellow-400" : "bg-gray-300"}`}
        >
          <Text className="text-black font-bold">Siguiente</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
