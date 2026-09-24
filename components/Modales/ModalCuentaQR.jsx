import { View, Text, TouchableOpacity, Image } from "react-native";
import BottomSheet from "../BottomSheet";
import ActionOverlay from "../ActionOverlay";
import { useGuardarQR } from "./hooks/useGuardarQR";

export default function ModalCuentaQR({ isOpen, onClose, user, qrCountry, onQRGuardado }) {
  const q = useGuardarQR({ user, qrCountry, onQRGuardado, onClose });
  const paisLabel = qrCountry === "PE" ? "Perú (Soles)" : "Bolivia (Bolivianos)";

  return (
    <BottomSheet
      visible={isOpen}
      onClose={q.cerrar}
      overlay={<ActionOverlay visible={q.loading} mensaje="Subiendo QR..." />}
      contentContainerStyle={{ alignItems: "center", paddingHorizontal: 24, paddingBottom: 36 }}
    >
      <Text className="text-xl font-lm-bold text-text mb-1">QR de cobro</Text>
      <Text className="text-sm font-sans text-text-muted mb-6">Para recibir en {paisLabel}</Text>

      <TouchableOpacity
        onPress={q.elegirImagen}
        className="w-full border-2 border-dashed border-border rounded-2xl p-6 items-center mb-6"
      >
        {q.imagen ? (
          <View className="items-center gap-2">
            <Image source={{ uri: q.imagen.uri }} style={{ width: 160, height: 160, borderRadius: 12 }} resizeMode="contain" />
            <Text className="text-sm font-sans text-text-muted mt-2">{q.imagen.name}</Text>
            <Text className="text-xs font-lm-medium text-primary-dark">Toca para cambiar</Text>
          </View>
        ) : (
          <>
            <Text className="text-5xl mb-3">📷</Text>
            <Text className="text-text font-lm-bold text-base">Seleccionar imagen QR</Text>
            <Text className="text-text-muted font-sans text-sm text-center mt-1">
              Toca para subir la imagen de tu código QR
            </Text>
          </>
        )}
      </TouchableOpacity>

      <View className="flex-row gap-3 w-full">
        <TouchableOpacity className="flex-1 border border-border py-3.5 rounded-2xl" onPress={q.cerrar} disabled={q.loading}>
          <Text className="text-text font-lm-medium text-base text-center">Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 py-3.5 rounded-2xl bg-primary"
          style={{ opacity: q.imagen && !q.loading ? 1 : 0.5 }}
          onPress={q.guardar}
          disabled={!q.imagen || q.loading}
        >
          <Text className="text-text font-lm-bold text-base text-center">Guardar QR</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}
