import { View, Text, Modal, Pressable,Linking } from "react-native";
import TcPuntoIcon from "./TcPuntoIcon";

export default function ComoFuncionaModal({ visible, onClose }) {

  const handleLink = async () => {
    const url = "https://transfercash.click";

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 items-center justify-center px-5">
        <View className="bg-white rounded-3xl overflow-hidden w-full max-w-sm">
          <Pressable onPress={onClose} className="absolute top-4 right-4 z-10 p-1">
            <Text className="text-gray-400 text-2xl leading-none">×</Text>
          </Pressable>

          <View className="items-center pt-8 pb-6 px-6">
            <View className="mb-3">
              <TcPuntoIcon size={56} />
            </View>

            <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
              ¿Qué son los TC Puntos?
            </Text>
            <Text className="text-gray-500 text-sm text-center leading-5 mb-5">
              Son puntos que acumulas al usar TC Cambio desde la web o app y que puedes canjear por recompensas disponibles.
            </Text>

            <View className="bg-gray-50 rounded-2xl p-4 mb-5 flex-row items-start gap-3 w-full">
              <TcPuntoIcon size={28} />
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-sm mb-0.5">¿Cómo ganar TC Puntos?</Text>
                <Text className="text-gray-500 text-xs leading-4">
                  Realiza operaciones de cambio de soles y al finalizar cada operación acumularás TC Puntos.
                </Text>
              </View>
            </View>

            <Text className="text-gray-900 font-bold text-base mb-3 text-center">
              ¿Cómo acumulas TC Puntos?
            </Text>

            <View className="border border-gray-200 rounded-2xl p-4 mb-3 w-full items-center">
              <Text className="text-gray-500 text-sm mb-1">Cambiando</Text>
              <View className="flex-row items-center gap-2">
                <Text className="text-3xl font-bold text-gray-900">S/ 1,000</Text>
                <Text className="text-blue-500 text-xl font-bold">=</Text>
                <View className="flex-row items-center gap-1">
                  <Text className="text-3xl font-bold text-gray-900">1</Text>
                  <TcPuntoIcon size={20} />
                  <Text className="text-gray-600 text-sm font-medium">TC Punto</Text>
                </View>
              </View>
            </View>

            <Pressable
              onPress={handleLink}
              className="w-full border border-gray-300 rounded-full py-3.5 items-center active:bg-gray-50"
            >
              <Text className="text-gray-800 font-semibold">Términos de uso</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
