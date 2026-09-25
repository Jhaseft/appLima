import { View, Text, Pressable } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { colors } from "../../theme/colors";

export default function IdiomaItem({ idioma, onPress }) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center px-5 py-4 border-b border-border">
      <Text className="text-2xl mr-4">{idioma.flag}</Text>
      <Text className="flex-1 text-base font-lm-medium text-text">{idioma.label}</Text>
      <View className="bg-primary-light rounded-full px-3 py-1 mr-2">
        <Text className="text-primary-dark text-xs font-lm-bold">Muy pronto</Text>
      </View>
      <ChevronRight size={20} color={colors.textMuted} />
    </Pressable>
  );
}
