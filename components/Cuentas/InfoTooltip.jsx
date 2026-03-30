import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from "react-native";
import { Info } from "lucide-react-native";
export default function InfoTooltip({ texto }) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        className="w-5 h-5 rounded-full bg-gray-200 items-center justify-center ml-4"
      >
        <Info size={20} color="#555" />
      </TouchableOpacity>

      <Modal transparent visible={visible} animationType="fade" onRequestClose={() => setVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View className="flex-1 justify-center items-center bg-black/40 px-10">
            <View className="bg-white rounded-2xl p-5 shadow-lg w-full">
              <Text className="text-gray-800 text-sm leading-5">{texto}</Text>
              <TouchableOpacity
                onPress={() => setVisible(false)}
                className="mt-4 bg-black rounded-xl py-2.5 items-center"
              >
                <Text className="text-white font-semibold text-sm">Entendido</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}
