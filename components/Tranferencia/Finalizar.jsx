import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { X } from "lucide-react-native";
import API_BASE_URL from "../api";

const MAX_COMPROBANTES = 5;

export default function Paso4({ onBack, setOperacion, operacion }) {
  const [comprobantes, setComprobantes] = useState([]);
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

  const handleEnviarTransferencia = async () => {
    if (!comprobantes.length) {
      setError(" Debes seleccionar al menos un comprobante antes de continuar.");
      return;
    }

    if (!operacion.cuentaOrigen || !operacion.cuentaDestino) {
      setError(" Debes seleccionar la cuenta de origen y destino.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("origin_account_id", operacion.cuentaOrigen.id);
      formData.append("destination_account_id", operacion.cuentaDestino.id);
      formData.append("amount", operacion.monto);
      formData.append("modo", operacion.modo);
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
        setError(data.message || "Error al crear la transferencia");
        setLoading(false);
        return;
      }

      setError("");
      setLoading(false);
      Alert.alert(
        "Operación Registrada",
        `Tu transferencia fue registrada correctamente.\nN° de operación: ${data.transfer_number}`,
        [{ text: "OK", onPress: () => router.replace("/") }]
      );
    } catch (err) {
      setError(`❌ No se pudo enviar la transferencia: ${err.message}`);
      setLoading(false);
    }
  };

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
      const nuevos = [...comprobantes, ...aAgregar];
      setComprobantes(nuevos);
      setOperacion((prev) => ({ ...prev, comprobantes: nuevos }));
      if (picked.length > disponibles) {
        setError(`Solo se agregaron ${disponibles}. Máximo ${MAX_COMPROBANTES} comprobantes.`);
      } else {
        setError("");
      }
    } catch (err) {
      setError(`❌ No se pudo seleccionar el comprobante: ${err.message}`);
    }
  };

  const handleRemove = (idx) => {
    const nuevos = comprobantes.filter((_, i) => i !== idx);
    setComprobantes(nuevos);
    setOperacion((prev) => ({ ...prev, comprobantes: nuevos }));
  };

  return (
    <ScrollView className="flex-1 bg-white px-6 py-4">
      <Text className="text-xl font-bold text-black text-center mb-6">
        Adjunta y Finaliza Operación
      </Text>

      <TouchableOpacity
        onPress={handlePickComprobante}
        disabled={comprobantes.length >= MAX_COMPROBANTES}
        className={`py-3 rounded-lg ${
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
        <View className="mt-4 flex-row flex-wrap justify-center gap-3">
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

      {error && (
        <Text className="text-red-500 text-sm mt-2 text-center">{error}</Text>
      )}

      <View className="flex-row justify-between mt-10 mb-8">
        <TouchableOpacity
          onPress={onBack}
          className="bg-gray-300 px-6 py-3 rounded-lg"
        >
          <Text className="text-black font-semibold">Atrás</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!comprobantes.length || loading}
          onPress={handleEnviarTransferencia}
          className={`px-6 py-3 rounded-lg ${
            comprobantes.length && !loading ? "bg-black" : "bg-gray-300"
          }`}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white font-bold">Finalizar</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
