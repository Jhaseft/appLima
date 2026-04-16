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
import { Copy, X } from "lucide-react-native";
import API_BASE_URL from "../api";
import { useTransferMethods } from "../hooks/useTransferMethods";

const MAX_COMPROBANTES = 5;

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

export default function FinalizarEfectivo({ onBack, operacion, setOperacion }) {
  const [comprobantes, setComprobantes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const router = useRouter();

  const { methods: opciones, loading: loadingMethods } = useTransferMethods(operacion.modo);

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

  const handlePickComprobante = async () => {
    try {
      if (comprobantes.length >= MAX_COMPROBANTES) {
        setError(`Solo puedes subir hasta ${MAX_COMPROBANTES} comprobantes.`);
        return;
      }
      const res = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
        multiple: true,
      });
      if (res.canceled) return;
      const picked = res.assets || (res.uri ? [res] : []);
      const disponibles = MAX_COMPROBANTES - comprobantes.length;
      const aAgregar = picked.slice(0, disponibles);
      setComprobantes((prev) => [...prev, ...aAgregar]);
      if (picked.length > disponibles) {
        setError(`Solo se agregaron ${disponibles}. Máximo ${MAX_COMPROBANTES} comprobantes.`);
      } else {
        setError("");
      }
    } catch (err) {
      setError("No se pudo seleccionar el comprobante.");
    }
  };

  const handleRemove = (idx) => {
    setComprobantes((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleEnviar = async () => {
    if (!comprobantes.length) {
      setError("Por favor, sube al menos un comprobante.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("amount", operacion.monto);
      formData.append("modo", operacion.modo);
      formData.append("payment_method_slug", "cash");
      comprobantes.forEach((c, idx) => {
        formData.append("comprobantes[]", {
          uri: c.uri,
          name: c.name || `comprobante_${idx + 1}.jpg`,
          type: c.mimeType || "image/jpeg",
        });
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

    
      <View className="mb-4">
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

      {/* Comprobantes */}
      <TouchableOpacity
        onPress={handlePickComprobante}
        disabled={comprobantes.length >= MAX_COMPROBANTES}
        className={`py-3 rounded-lg mb-3 ${
          comprobantes.length >= MAX_COMPROBANTES ? "bg-gray-300" : "bg-yellow-400"
        }`}
      >
        <Text className="text-black font-bold text-center">
          {comprobantes.length
            ? `Agregar otro comprobante (${comprobantes.length}/${MAX_COMPROBANTES})`
            : "Subir comprobante"}
        </Text>
      </TouchableOpacity>

      {comprobantes.length > 0 && (
        <View className="flex-row flex-wrap justify-center gap-3 mb-3">
          {comprobantes.map((c, idx) => (
            <View key={idx} className="relative">
              {c.mimeType?.startsWith("image/") || c.uri?.match(/\.(jpg|jpeg|png)$/i) ? (
                <Image
                  source={{ uri: c.uri }}
                  className="w-28 h-28 rounded-lg"
                />
              ) : (
                <View className="w-28 h-28 rounded-lg bg-gray-100 items-center justify-center px-1">
                  <Text className="text-black text-xs text-center" numberOfLines={3}>
                    📄 {c.name}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                onPress={() => handleRemove(idx)}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
              >
                <X size={14} color="white" />
              </TouchableOpacity>
            </View>
          ))}
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
          disabled={!comprobantes.length || loading}
          onPress={handleEnviar}
          className={`px-6 py-3 rounded-lg ${
            comprobantes.length && !loading ? "bg-black" : "bg-gray-300"
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
