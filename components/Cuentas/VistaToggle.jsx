import { View, Text, TouchableOpacity } from "react-native";
import { Landmark, QrCode } from "lucide-react-native";
import { colors } from "../../theme/colors";

const OPCIONES = [
  { key: "bank", label: "Bancaria", Icon: Landmark },
  { key: "qr", label: "QR", Icon: QrCode },
];

export default function VistaToggle({ value, onChange }) {
  return (
    <View className="flex-row bg-surface border border-border rounded-2xl p-1 mb-6">
      {OPCIONES.map(({ key, label, Icon }) => {
        const activa = value === key;
        return (
          <TouchableOpacity
            key={key}
            className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl ${activa ? "bg-primary" : ""}`}
            onPress={() => onChange(key)}
          >
            <Icon size={18} color={activa ? colors.text : colors.textMuted} />
            <Text className={`text-sm ${activa ? "font-lm-bold text-text" : "font-sans text-text-muted"}`}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
