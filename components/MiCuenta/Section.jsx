import { View, Text } from "react-native";

export default function Section({ title, children }) {
  return (
    <View className="mb-5">
      <Text className="text-xs font-lm-bold text-primary-accent uppercase tracking-widest mb-1 px-1">
        {title}
      </Text>
      <View className="bg-background rounded-2xl border border-border px-4">
        {children}
      </View>
    </View>
  );
}
