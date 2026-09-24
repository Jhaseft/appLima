import { View, Text, Image, TouchableOpacity } from "react-native";
import { Plus, RefreshCw } from "lucide-react-native";
import { colors } from "../../theme/colors";
import Bone from "../Home/Bone";

const LABELS = {
  PE: { label: "QR Perú (Soles)", bandera: "🇵🇪", pais: "Perú" },
  BO: { label: "QR Bolivia (Bolivianos)", bandera: "🇧🇴", pais: "Bolivia" },
};

export default function TarjetaQR({ country, cuenta, loading, onAdd }) {
  const info = LABELS[country];

  return (
    <View className="mb-5 bg-surface border border-border rounded-2xl p-4">
      <View className="flex-row items-center mb-3 gap-2">
        <Text className="text-lg">{info.bandera}</Text>
        <Text className="font-lm-bold text-base text-text">{info.label}</Text>
      </View>

      {loading ? (
        <Bone className="rounded-xl h-44" />
      ) : cuenta ? (
        <View className="items-center gap-3">
          <View className="bg-background p-2 rounded-xl border border-border">
            <Image
              source={{ uri: cuenta.qr_value }}
              style={{ width: 160, height: 160 }}
              resizeMode="contain"
            />
          </View>
          <Text className="text-xs text-success font-lm-medium">QR guardado</Text>
          <TouchableOpacity
            className="flex-row items-center gap-2 border border-border px-4 py-2 rounded-xl"
            onPress={onAdd}
          >
            <RefreshCw size={14} color={colors.text} />
            <Text className="text-text text-sm font-lm-medium">Cambiar QR</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="items-center gap-3 py-4">
          <Text className="text-text-muted text-sm text-center">
            No tienes un QR registrado para {info.pais}.
          </Text>
          <TouchableOpacity
            className="flex-row items-center gap-2 bg-primary px-5 py-3 rounded-xl"
            onPress={onAdd}
          >
            <Plus size={16} color={colors.text} />
            <Text className="text-text font-lm-bold text-sm">Agregar QR</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
