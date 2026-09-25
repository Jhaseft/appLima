import { View, Text } from "react-native";

export default function FieldWrapper({ label, error, children }) {
  return (
    <View className="w-full mb-4 mt-1 relative">
      <View
        className={`border-2 rounded-xl px-4 pt-3 pb-2 bg-background ${
          error ? "border-danger" : "border-border"
        }`}
      >
        <Text className="text-text-muted font-lm-medium text-xs absolute -top-2 left-3 bg-background px-1">
          {label}
        </Text>
        {children}
      </View>
      {error ? <Text className="text-danger text-xs mt-1 font-sans">{error}</Text> : null}
    </View>
  );
}
