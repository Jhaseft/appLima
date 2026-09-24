import { View, Text, ActivityIndicator } from "react-native";
import { colors } from "../theme/colors";

// Overlay estandar para MUTACIONES (crear / eliminar / actualizar / subir): un
// View absoluto (NO Modal) que tapa a su contenedor con velo oscuro, spinner y
// mensaje, bloqueando los toques mientras dura la accion. No usa Modal nativo a
// proposito: apilar Modals en iOS deja una capa fantasma que bloquea el touch.
//
// - A nivel de pantalla (cubrir header + tabs) se monta desde el FeedbackProvider
//   (raiz, por encima del navegador).
// - Dentro de un Modal (ej. modales de cuenta) se monta como hijo y cubre ese
//   Modal, ya que un overlay de raiz no puede tapar una ventana Modal nativa.
export default function ActionOverlay({ visible, mensaje = "Procesando..." }) {
  if (!visible) return null;

  return (
    <View
      className="absolute inset-0 z-50 justify-center items-center bg-black/60"
      style={{ elevation: 1000 }}
    >
      <ActivityIndicator size="large" color={colors.background} />
      <Text className="text-background mt-3 text-base font-lm-medium">{mensaje}</Text>
    </View>
  );
}
