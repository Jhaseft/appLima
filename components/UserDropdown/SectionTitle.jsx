import { View, Text } from "react-native";

export default function SectionTitle({ title }) {
  return (
    <View className="flex-row items-center px-5 pt-6 pb-2">
      <Text className="text-primary-accent text-xs font-lm-bold uppercase tracking-widest mr-3">
        {title}
      </Text>
      <View className="flex-1 h-px bg-border bg-primary-accent" />
    </View>
  );
}
