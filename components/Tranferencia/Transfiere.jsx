import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Copy, MapPin, ExternalLink } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import { useTransferMethods } from "../hooks/useTransferMethods";

const OFICINAS = [
  {
    nombre: "Oficina Cochabamba",
    direccion: "Av. Villazón, calle Los Paraisos – frente a UDABOL",
    horario: "Lun–Sáb 8:00–17:00 | Dom solo transferencia/QR",
    imagenLugar:
      "https://res.cloudinary.com/dnbklbswg/image/upload/v1775453600/Screenshot_2026-04-06_013159_s9h9w6.png",
    imagenMapa:
      "https://res.cloudinary.com/dnbklbswg/image/upload/v1775453669/Screenshot_2026-04-06_013416_z3hvxo.png",
    linkMapa: "https://maps.app.goo.gl/EnjPUumyYn7hSRxH7",
  },
];

export default function Transfiere({ onNext, onBack, operacion }) {
  const [confirmado, setConfirmado] = useState(false);

  const { methods: opciones, loading: loadingMethods } = useTransferMethods(operacion.modo);

  const isBOBtoPEN = operacion.modo === "BOBtoPEN";
  const slug = operacion.nonBankMethod;

  const montoTexto = isBOBtoPEN ? `${operacion.monto} BOB` : `${operacion.monto} PEN`;
  const conversionTexto = isBOBtoPEN ? `${operacion.conversion} PEN` : `${operacion.conversion} BOB`;

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
  };

  // ─── Decidir qué mostrar ───────────────────────────────
  // BOBtoPEN + cash → oficinas
  // BOBtoPEN + qr   → QR empresa
  // PENtoBOB        → cuentas bancarias empresa (ignorar items qr)
  const showOficinas = isBOBtoPEN && slug === "cash";
  const showQrEmpresa = isBOBtoPEN && slug === "qr";

  const bankOps = !isBOBtoPEN ? opciones.filter((m) => m.type !== "qr") : [];
  const qrEmpresa = showQrEmpresa ? opciones.find((m) => m.type === "qr") : null;

  return (
    <ScrollView className="flex-1 bg-white px-4 py-4">
      <Text className="text-xl font-bold text-black text-center mb-4">
        {showOficinas ? "Pago en oficina" : "Realiza tu transferencia"}
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

      {showOficinas && (
        <View className="bg-gray-900 rounded-xl p-4 mb-4">
          <Text className="text-yellow-400 font-bold text-base text-center mb-3">
            Acércate a nuestra oficina
          </Text>
          {OFICINAS.map((of, i) => (
            <View key={i} className="gap-2">
              <Image source={{ uri: of.imagenLugar }} className="w-full h-36 rounded-xl" resizeMode="cover" />
              <Image source={{ uri: of.imagenMapa }} className="w-full h-36 rounded-xl mt-1" resizeMode="cover" />
              <View className="mt-1">
                <View className="flex-row items-center gap-1">
                  <MapPin size={14} color="#facc15" />
                  <Text className="text-yellow-400 font-semibold text-sm">{of.nombre}</Text>
                </View>
                <Text className="text-gray-300 text-xs mt-0.5">{of.direccion}</Text>
                <Text className="text-gray-400 text-xs">{of.horario}</Text>
                <TouchableOpacity
                  onPress={() => Linking.openURL(of.linkMapa)}
                  className="mt-2 bg-yellow-400 py-2 rounded-xl flex-row justify-center items-center gap-2"
                >
                  <ExternalLink size={14} color="#000" />
                  <Text className="text-black font-bold text-sm">Ver en Google Maps</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {showQrEmpresa && (
        <View className="gap-3 mb-4">
          <Text className="text-black font-semibold">Escanea el QR para pagar</Text>
          {loadingMethods ? (
            <ActivityIndicator size="small" color="#000" />
          ) : qrEmpresa ? (
            <View className="items-center p-4 border rounded-lg bg-white shadow">
              <Image source={{ uri: qrEmpresa.image }} className="w-60 h-60" resizeMode="contain" />
            </View>
          ) : (
            <Text className="text-red-600 text-sm text-center">No hay QR de empresa configurado.</Text>
          )}
        </View>
      )}

      {!isBOBtoPEN && (
        <View className="gap-3 mb-4">
          <Text className="text-black font-semibold">Realiza el depósito a:</Text>
          {loadingMethods ? (
            <ActivityIndicator size="small" color="#000" />
          ) : bankOps.length === 0 ? (
            <Text className="text-gray-400 text-sm text-center">Sin métodos disponibles</Text>
          ) : (
            bankOps.map((op, idx) => (
              <View
                key={idx}
                className="flex-row items-center gap-3 border rounded-lg p-3 bg-white shadow"
              >
                <Image source={{ uri: op.image }} className="w-12 h-12" resizeMode="contain" />
                <View className="flex-1">
                  <Text className="font-bold text-black">{op.title}</Text>
                  <Text className="text-gray-700">Número: {op.number}</Text>
                </View>
                <TouchableOpacity onPress={() => copyToClipboard(op.number)}>
                  <Copy size={20} color="black" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      )}

      {showOficinas && (
        <View className="border rounded-lg bg-yellow-50 border-yellow-200 p-3 mt-4">
          <Text className="text-yellow-800 text-xs">
            Al continuar, reservas este tipo de cambio. Acércate a nuestra
            oficina para pagar en efectivo y completar la operación.
          </Text>
        </View>
      )}

      <View className="flex-row items-center justify-between mt-6 px-2">
        <Text className="text-black font-medium flex-1 pr-2">
          {showOficinas
            ? "Confirmo que pagaré en oficina con este tipo de cambio"
            : "Ya envié el dinero"}
        </Text>
        <Switch value={confirmado} onValueChange={setConfirmado} />
      </View>

      <View className="flex-row justify-between mt-10 mb-8">
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
