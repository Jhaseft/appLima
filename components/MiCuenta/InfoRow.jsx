import { View, Text } from "react-native";
import { colors } from "../../theme/colors";

export default function InfoRow({ icon: Icon, label, value, rightElement }) {
  return (
    <View className="flex-row items-center py-4 border-b border-border">
      <View className="w-9 h-9 rounded-full bg-primary-light items-center justify-center mr-4">
        <Icon size={18} color={colors.primaryDark} />
      </View>
      <View className="flex-1">
        <Text className="text-text-muted text-xs mb-0.5">{label}</Text>
        <Text className="text-text text-sm font-lm-medium">{value || "—"}</Text>
      </View>
      {rightElement}
    </View>
  );
}
