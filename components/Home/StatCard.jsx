import { View, Text } from "react-native";
import { colors } from "../../theme/colors";

export default function StatCard({ label, value, prefix = "", Icon, width }) {
  return (
    <View style={{ width }} className="bg-surface rounded-3xl border border-border p-5">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-2">
          <Text className="text-sm font-lm-medium text-text-muted" numberOfLines={2}>
            {label}
          </Text>
          <Text className="text-2xl font-lm-bold text-text mt-2" numberOfLines={1}>
            {prefix}{value}
          </Text>
        </View>
        <View className="w-12 h-12 rounded-2xl items-center justify-center">
          <Icon size={22} color={colors.primaryDark} />
        </View>
      </View>
    </View>
  );
}
