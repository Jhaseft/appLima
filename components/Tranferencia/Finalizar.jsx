import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import { useUser } from "../ContextUser/UserContext";

export default function Paso4({ onBack, setOperacion, operacion }) {
  const [comprobante, setComprobante] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  const router = useRouter();
  const { user, fetchUser } = useUser();
  const pollingRef = useRef(null);

  // Cargar token al inicio
  useEffect(() => {
    (async () => {
      const savedToken = await AsyncStorage.getItem("token");
      setToken(savedToken);
    })();

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  // Auto-refresh KYC si viene del navegador
  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const needsRefresh = await AsyncStorage.getItem("needsKycRefresh");
        if (needsRefresh === "true") {
          const updatedUser = await fetchUser();
          await AsyncStorage.removeItem("needsKycRefresh");
          if (updatedUser?.kyc_status === "verified") {
            Alert.alert("KYC Completo", "Tu identidad fue verificada correctamente.");
          }
        }
      })();
    }, [])
  );

  // Polling seguro
  const startKycPolling = () => {
    if (pollingRef.current) return;
    pollingRef.current = setInterval(async () => {
      const updatedUser = await fetchUser();
      if (updatedUser?.kyc_status === "verified") {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
        Alert.alert("KYC Completo", "¡Tu identidad fue verificada!");
      }
    }, 3000);
  };

  const openKycInBrowser = async () => {
    if (!user?.id || !token) return;
    const url = `https://panel.transfercash.click/mobile-face-view?token=${encodeURIComponent(token)}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await AsyncStorage.setItem("needsKycRefresh", "true");
        startKycPolling();
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "No se puede abrir el navegador.");
      }
    } catch {
      Alert.alert("Error", "Hubo un problema al abrir el KYC.");
    }
  };

  const handleEnviarTransferencia = async () => {
    if (user?.kyc_status !== "verified") {
      Alert.alert(
        "KYC Pendiente",
        "Debes completar tu verificación KYC antes de realizar operaciones.",
        [
          { text: "Ir a KYC", onPress: openKycInBrowser },
          { text: "Cancelar", style: "cancel" },
        ]
      );
      return;
    }

    if (!comprobante) {
      setError("❌ Debes seleccionar un comprobante antes de continuar.");
      return;
    }

    if (!operacion.cuentaOrigen || !operacion.cuentaDestino) {
      setError("❌ Debes seleccionar la cuenta de origen y destino.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("origin_account_id", operacion.cuentaOrigen.id);
      formData.append("destination_account_id", operacion.cuentaDestino.id);
      formData.append("amount", operacion.monto);
      formData.append("exchange_rate", operacion.tasa);
      formData.append("converted_amount", operacion.conversion);
      formData.append("modo", operacion.modo);
      formData.append("comprobante", {
        uri: comprobante.uri,
        name: comprobante.name || "comprobante.jpg",
        type: comprobante.mimeType || "image/jpeg",
      });

      const response = await fetch(
        "https://panel.transfercash.click/api/operacion/crear-transferencia",
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
        "La transferencia se registró correctamente.",
        [{ text: "OK", onPress: () => router.replace("/") }]
      );
    } catch (err) {
      setError(`❌ No se pudo enviar la transferencia: ${err.message}`);
      setLoading(false);
    }
  };

  const handlePickComprobante = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });
      if (res.canceled) return;

      const file = res.assets?.[0] || res;
      setComprobante(file);
      setOperacion((prev) => ({ ...prev, comprobante: file }));
      setError("");
    } catch (err) {
      setError(`❌ No se pudo seleccionar el comprobante: ${err.message}`);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 py-4">
      <Text className="text-xl font-bold text-black text-center mb-6">
        Adjunta y Finaliza Operación
      </Text>

      <TouchableOpacity
        onPress={handlePickComprobante}
        className="bg-yellow-400 py-3 rounded-lg"
      >
        <Text className="text-black font-bold text-center">
          {comprobante ? "Cambiar comprobante" : "Subir comprobante"}
        </Text>
      </TouchableOpacity>

      {comprobante && (
        <View className="mt-6 items-center">
          {comprobante.mimeType?.startsWith("image/") ? (
            <Image
              source={{ uri: comprobante.uri }}
              className="w-60 h-60 rounded-lg"
            />
          ) : (
            <Text className="text-black mt-2">📄 {comprobante.name}</Text>
          )}
        </View>
      )}

      {error && (
        <Text className="text-red-500 text-sm mt-2 text-center">{error}</Text>
      )}

      <View className="flex-row justify-between mt-10">
        <TouchableOpacity
          onPress={onBack}
          className="bg-gray-300 px-6 py-3 rounded-lg"
        >
          <Text className="text-black font-semibold">Atrás</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!comprobante || loading}
          onPress={handleEnviarTransferencia}
          className={`px-6 py-3 rounded-lg ${
            comprobante && !loading ? "bg-black" : "bg-gray-300"
          }`}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white font-bold">Finalizar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
