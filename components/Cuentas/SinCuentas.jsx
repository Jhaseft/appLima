import { View, Text } from "react-native";

export default function SinCuentas({ mensaje }) {
  return (
    <View className="border border-dashed border-border rounded-xl px-4 py-5 bg-surface items-center mb-2">
      <Text className="text-text-muted text-sm text-center leading-5">{mensaje}</Text>
    </View>
  );
}
