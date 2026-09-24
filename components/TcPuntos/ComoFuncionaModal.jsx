import { View, Text, Modal, Pressable, Linking } from "react-native";
import TcPuntoIcon from "./TcPuntoIcon";

export default function ComoFuncionaModal({ visible, onClose, moneda = "S/", umbral = 1000 }) {
  const handleLink = async () => {
    const url = "https://transfercash.click";
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 items-center justify-center px-5">
        <View className="bg-background rounded-3xl overflow-hidden w-full max-w-sm">
          <Pressable onPress={onClose} className="absolute top-4 right-4 z-10 p-1">
            <Text className="text-text-muted text-2xl leading-none">×</Text>
          </Pressable>

          <View className="items-center pt-8 pb-6 px-6">
            <View className="mb-3">
              <TcPuntoIcon size={56} />
            </View>

            <Text className="text-xl font-lm-bold text-text mb-2 text-center">
              ¿Qué son los TC Puntos?
            </Text>
            <Text className="text-text-muted text-sm text-center leading-5 mb-5">
              Son puntos que acumulas al usar TC Cambio desde la web o app y que puedes canjear por recompensas disponibles.
            </Text>

            <View className="bg-surface rounded-2xl p-4 mb-5 flex-row items-start gap-3 w-full">
              <TcPuntoIcon size={28} />
              <View className="flex-1">
                <Text className="text-text font-lm-bold text-sm mb-0.5">¿Cómo ganar TC Puntos?</Text>
                <Text className="text-text-muted text-xs leading-4">
                  Realiza operaciones de cambio de soles y al finalizar cada operación acumularás TC Puntos.
                </Text>
              </View>
            </View>

            <Text className="text-text font-lm-bold text-base mb-3 text-center">
              ¿Cómo acumulas TC Puntos?
            </Text>

            <View className="border border-border rounded-2xl p-4 mb-3 w-full items-center">
              <Text className="text-text-muted text-sm mb-1">Cambiando</Text>
              <View className="flex-row items-center gap-2">
                <Text className="text-3xl font-lm-bold text-text">{moneda} {Number(umbral).toLocaleString()}</Text>
                <Text className="text-primary-dark text-xl font-lm-bold">=</Text>
                <View className="flex-row items-center gap-1">
                  <Text className="text-3xl font-lm-bold text-text">1</Text>
                  <TcPuntoIcon size={20} />
                  <Text className="text-text-muted text-sm font-lm-medium">TC Punto</Text>
                </View>
              </View>
            </View>

            <Pressable
              onPress={handleLink}
              className="w-full border border-border rounded-full py-3.5 items-center active:bg-surface"
            >
              <Text className="text-text font-lm-medium">Términos de uso</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
