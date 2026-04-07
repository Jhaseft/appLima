import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  Linking,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as Clipboard from "expo-clipboard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Copy, MapPin, ExternalLink } from "lucide-react-native";
import API_BASE_URL from "../api";

const OFICINAS = [
  {
    nombre: "Oficina Cochabamba",
    direccion: "Av. Villazón, calle Los Paraisos – frente a UDABOL",
    horario: "Lun–Vie 9:00–18:00 | Sáb 9:00–13:00",
    imagenLugar:
      "https://res.cloudinary.com/dnbklbswg/image/upload/v1775453600/Screenshot_2026-04-06_013159_s9h9w6.png",
    imagenMapa:
      "https://res.cloudinary.com/dnbklbswg/image/upload/v1775453669/Screenshot_2026-04-06_013416_z3hvxo.png",
    linkMapa: "https://maps.app.goo.gl/EnjPUumyYn7hSRxH7",
  },
];

const CUENTAS_DESTINO = {
  PENtoBOB: [
    {
      type: "Yape",
      title: "Yape Perú",
      number: "947847817",
      image:
        "https://res.cloudinary.com/dnbklbswg/image/upload/v1756359619/yape-logo-png_seeklogo-504685_tns3su.png",
    },
    {
      type: "Plin",
      title: "Plin Perú",
      number: "947847817",
      image:
        "https://res.cloudinary.com/dnbklbswg/image/upload/v1756359595/plin_fi3i8u.png",
    },
    {
      type: "InterBank",
      title: "InterBank Perú",
      number: "4403006144735",
      image:
        "https://res.cloudinary.com/dnbklbswg/image/upload/v1756305466/download_zxsiny.png",
    },
    {
      type: "BCP",
      title: "BCP Perú",
      number: "2207063622037",
      image:
        "https://res.cloudinary.com/dnbklbswg/image/upload/v1756304903/bcp_mtkdyl.png",
    },
  ],
  BOBtoPEN: [
    {
      type: "qr",
      title: "QR Bolivia",
      image:
        "https://res.cloudinary.com/dnbklbswg/image/upload/v1756359417/qr_hgokvi.jpg",
    },
  ],
};

export default function FinalizarEfectivo({ onBack, operacion, setOperacion }) {
  const [comprobante, setComprobante] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const savedToken = await AsyncStorage.getItem("token");
      setToken(savedToken);
    })();
  }, []);

  const isBOBtoPEN = operacion.modo === "BOBtoPEN";
  const montoTexto = isBOBtoPEN
    ? `${operacion.monto} BOB`
    : `${operacion.monto} PEN`;
  const conversionTexto = isBOBtoPEN
    ? `${operacion.conversion} PEN`
    : `${operacion.conversion} BOB`;
  const opciones = CUENTAS_DESTINO[operacion.modo] || [];

  const handlePickComprobante = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });
      if (res.canceled) return;
      const file = res.assets?.[0] || res;
      setComprobante(file);
      setError("");
    } catch (err) {
      setError("No se pudo seleccionar el comprobante.");
    }
  };

  const handleEnviar = async () => {
    if (!comprobante) {
      setError("Por favor, sube un comprobante.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("amount", operacion.monto);
      formData.append("modo", operacion.modo);
      formData.append("payment_method_slug", "cash");
      formData.append("comprobante", {
        uri: comprobante.uri,
        name: comprobante.name || "comprobante.jpg",
        type: comprobante.mimeType || "image/jpeg",
      });

      const response = await fetch(
        `${API_BASE_URL}/api/operacion/crear-transferencia`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Error al crear la transferencia.");
        setLoading(false);
        return;
      }

      setLoading(false);
      Alert.alert(
        "Operación Registrada",
        `Tu operación en efectivo fue registrada.\nN° de operación: ${data.transfer_number}`,
        [{ text: "OK", onPress: () => router.replace("/") }]
      );
    } catch (err) {
      setError(`No se pudo enviar la transferencia: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-4 py-4">
      <Text className="text-xl font-bold text-black text-center mb-4">
        Operación en Efectivo
      </Text>

      {/* Resumen de operación */}
      <View className="border rounded-lg bg-gray-50 p-4 mb-4">
        <Text className="text-black">
          <Text className="font-semibold">Monto a enviar: </Text>
          {montoTexto}
        </Text>
        <Text className="text-black">
          <Text className="font-semibold">Monto a recibir: </Text>
          <Text className="text-green-600 font-semibold">{conversionTexto}</Text>
        </Text>
        <Text className="text-black">
          <Text className="font-semibold">Tasa: </Text>
          {operacion.tasa}
        </Text>
      </View>

      {/* Oficinas */}
      <View className="bg-gray-900 rounded-xl p-4 mb-4">
        <Text className="text-yellow-400 font-bold text-base text-center mb-3">
          Nuestras Oficinas
        </Text>
        {OFICINAS.map((of, i) => (
          <View key={i} className="gap-2">
            <Image
              source={{ uri: of.imagenLugar }}
              className="w-full h-36 rounded-xl"
              resizeMode="cover"
            />
            <Image
              source={{ uri: of.imagenMapa }}
              className="w-full h-36 rounded-xl mt-1"
              resizeMode="cover"
            />
            <View className="mt-1">
              <Text className="text-yellow-400 font-semibold text-sm">
                📍 {of.nombre}
              </Text>
              <Text className="text-gray-300 text-xs mt-0.5">{of.direccion}</Text>
              <Text className="text-gray-400 text-xs">{of.horario}</Text>
              <TouchableOpacity
                onPress={() => Linking.openURL(of.linkMapa)}
                className="mt-2 bg-yellow-400 py-2 rounded-xl flex-row justify-center items-center gap-2"
              >
                <Text className="text-black font-bold text-sm">
                  Ver en Google Maps
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Cuentas o QR */}
      <View className="mb-4">
        <Text className="text-black font-semibold mb-2">
          {isBOBtoPEN ? "Escanea el QR para transferir" : "Realiza el depósito a:"}
        </Text>
        {opciones.map((op, idx) => {
          if (op.type === "qr") {
            return (
              <View key={idx} className="items-center p-4 border rounded-lg bg-white shadow">
                <Text className="font-semibold text-black mb-2">Escanea el QR</Text>
                <Image
                  source={{ uri: op.image }}
                  className="w-40 h-40"
                  resizeMode="contain"
                />
              </View>
            );
          }
          return (
            <View
              key={idx}
              className="flex-row items-center gap-3 border rounded-lg p-3 bg-white shadow mb-2"
            >
              <Image
                source={{ uri: op.image }}
                className="w-12 h-12"
                resizeMode="contain"
              />
              <View className="flex-1">
                <Text className="font-bold text-black">{op.title}</Text>
                <Text className="text-gray-700 text-sm">Número: {op.number}</Text>
              </View>
              <TouchableOpacity onPress={() => Clipboard.setStringAsync(op.number)}>
                <Copy size={20} color="black" />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* Comprobante */}
      <TouchableOpacity
        onPress={handlePickComprobante}
        className="bg-yellow-400 py-3 rounded-lg mb-3"
      >
        <Text className="text-black font-bold text-center">
          {comprobante ? "Cambiar comprobante" : "Subir comprobante"}
        </Text>
      </TouchableOpacity>

      {comprobante && (
        <View className="items-center mb-3">
          {comprobante.mimeType?.startsWith("image/") ? (
            <Image
              source={{ uri: comprobante.uri }}
              className="w-60 h-60 rounded-lg"
            />
          ) : (
            <Text className="text-black">📄 {comprobante.name}</Text>
          )}
        </View>
      )}

      {error ? (
        <Text className="text-red-500 text-sm text-center mb-3">{error}</Text>
      ) : null}

      {/* Botones */}
      <View className="flex-row justify-between mt-4 mb-8">
        <TouchableOpacity onPress={onBack} className="bg-gray-300 px-6 py-3 rounded-lg">
          <Text className="text-black font-semibold">Atrás</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!comprobante || loading}
          onPress={handleEnviar}
          className={`px-6 py-3 rounded-lg ${
            comprobante && !loading ? "bg-black" : "bg-gray-300"
          }`}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white font-bold">Enviar</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
