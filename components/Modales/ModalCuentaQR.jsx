import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../api";

export default function ModalCuentaQR({ isOpen, onClose, user, qrCountry, onQRGuardado }) {
  const [imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(false);

  const paisLabel = qrCountry === "PE" ? "Perú (Soles)" : "Bolivia (Bolivianos)";

  const handlePickImagen = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ["image/jpeg", "image/png", "image/jpg"],
        copyToCacheDirectory: true,
      });
      if (res.canceled) return;
      const file = res.assets?.[0] || res;
      setImagen(file);
    } catch (err) {
      Alert.alert("Error", "No se pudo seleccionar la imagen: " + err.message);
    }
  };

  const handleGuardar = async () => {
    if (!imagen) {
      Alert.alert("Error", "Selecciona una imagen de QR.");
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const formData = new FormData();
      formData.append("user_id", user.id);
      formData.append("method_type", "qr");
      formData.append("qr_country", qrCountry);
      formData.append("qr_image", {
        uri: imagen.uri,
        name: imagen.name || "qr.jpg",
        type: imagen.mimeType || "image/jpeg",
      });

      const res = await fetch(`${API_BASE_URL}/api/operacion/guardar-cuenta`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al guardar el QR.");

      onQRGuardado?.(data);
      Alert.alert("Éxito", "QR guardado correctamente");
      setImagen(null);
      onClose();
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setImagen(null);
    onClose();
  };

  return (
    <Modal visible={isOpen} transparent animationType="slide" onRequestClose={handleClose}>
      <View className="flex-1 justify-end bg-black/50">
        {loading && (
          <View className="absolute inset-0 justify-center items-center bg-black/60 z-50">
            <ActivityIndicator size="large" color="white" />
            <Text className="text-white mt-3 text-base font-medium">Subiendo QR...</Text>
          </View>
        )}

        <ScrollView
          contentContainerStyle={{ alignItems: "center", paddingHorizontal: 24, paddingBottom: 36 }}
          className="bg-white rounded-t-3xl max-h-[80%]"
        >
          <View className="w-10 h-1 bg-gray-300 rounded-full mt-4 mb-6" />

          <Text className="text-xl font-bold text-gray-900 mb-1">QR de cobro</Text>
          <Text className="text-sm text-gray-400 mb-6">Para recibir en {paisLabel}</Text>

          <TouchableOpacity
            onPress={handlePickImagen}
            className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-6 items-center mb-6"
          >
            {imagen ? (
              <View className="items-center gap-2">
                <Image
                  source={{ uri: imagen.uri }}
                  style={{ width: 160, height: 160, borderRadius: 12 }}
                  resizeMode="contain"
                />
                <Text className="text-sm text-gray-500 mt-2">{imagen.name}</Text>
                <Text className="text-xs text-blue-600">Toca para cambiar</Text>
              </View>
            ) : (
              <>
                <Text className="text-5xl mb-3">📷</Text>
                <Text className="text-gray-700 font-semibold text-base">Seleccionar imagen QR</Text>
                <Text className="text-gray-400 text-sm text-center mt-1">
                  Toca para subir la imagen de tu código QR
                </Text>
              </>
            )}
          </TouchableOpacity>

          <View className="flex-row gap-3 w-full">
            <TouchableOpacity
              className="flex-1 border border-gray-200 py-3.5 rounded-2xl"
              onPress={handleClose}
              disabled={loading}
            >
              <Text className="text-gray-700 font-semibold text-base text-center">Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3.5 rounded-2xl ${imagen && !loading ? "bg-blue-600" : "bg-blue-300"}`}
              onPress={handleGuardar}
              disabled={!imagen || loading}
            >
              <Text className="text-white font-semibold text-base text-center">Guardar QR</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
