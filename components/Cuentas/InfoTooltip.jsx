import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from "react-native";
import { Info } from "lucide-react-native";
import { colors } from "../../theme/colors";

export default function InfoTooltip({ texto }) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        className="w-5 h-5 rounded-full bg-surface border border-border items-center justify-center ml-4"
      >
        <Info size={20} color={colors.textMuted} />
      </TouchableOpacity>

      <Modal transparent visible={visible} animationType="fade" onRequestClose={() => setVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View className="flex-1 justify-center items-center bg-black/40 px-10">
            <View className="bg-background rounded-2xl p-5 shadow-lg w-full">
              <Text className="text-text text-sm leading-5">{texto}</Text>
              <TouchableOpacity
                onPress={() => setVisible(false)}
                className="mt-4 bg-primary rounded-xl py-2.5 items-center"
              >
                <Text className="text-text font-lm-bold text-sm">Entendido</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}
