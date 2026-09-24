import { View, Text, TouchableOpacity } from "react-native";
import { CheckCircle2, XCircle, Info } from "lucide-react-native";
import { colors } from "../../theme/colors";

const ICONOS = {
  success: { Icon: CheckCircle2, color: colors.success },
  error: { Icon: XCircle, color: colors.danger },
  info: { Icon: Info, color: colors.primaryAccent },
};

// Card de feedback (exito / error / info + confirmacion). Es un View absoluto a
// pantalla completa (NO Modal), montado en la raiz por el FeedbackProvider, para
// no apilar Modals nativos (eso bloquea el touch en iOS).
export default function FeedbackModal({ dialog, onConfirm, onCancel }) {
  if (!dialog) return null;

  const {
    mode,
    type = "info",
    title,
    message,
    confirmText = "Entendido",
    cancelText = "Cancelar",
    destructive,
  } = dialog;

  const { Icon, color } = ICONOS[type] ?? ICONOS.info;
  const esConfirm = mode === "confirm";

  return (
    <View
      className="absolute inset-0 z-50 justify-center items-center bg-black/50 px-8"
      style={{ elevation: 1000 }}
    >
      <View className="w-full bg-background rounded-3xl p-6 items-center">
        <Icon size={48} color={color} />
        {!!title && <Text className="text-text font-lm-bold text-lg mt-4 text-center">{title}</Text>}
        {!!message && (
          <Text className="text-text-muted text-sm mt-2 text-center leading-5">{message}</Text>
        )}

        <View className="flex-row gap-3 w-full mt-6">
          {esConfirm && (
            <TouchableOpacity className="flex-1 border border-border py-3 rounded-2xl" onPress={onCancel}>
              <Text className="text-text font-lm-medium text-center">{cancelText}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className={`flex-1 py-3 rounded-2xl ${destructive ? "bg-danger" : "bg-primary"}`}
            onPress={onConfirm}
          >
            <Text className={`font-lm-bold text-center ${destructive ? "text-background" : "text-text"}`}>
              {confirmText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
