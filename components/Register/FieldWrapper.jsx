import { View, Text } from "react-native";

export default function FieldWrapper({ label, error, children }) {
  return (
    <View className="w-full mb-4 mt-1 relative">
      <View className={`border-2 rounded-xl px-4 pt-3 pb-2 bg-white ${error ? "border-red-500" : "border-black"}`}>
        <Text className="text-black text-xs absolute -top-2 left-3 bg-white px-1">{label}</Text>
        {children}
      </View>
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
}
