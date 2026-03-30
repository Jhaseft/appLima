import { View, Text } from "react-native";

export default function SinCuentas({ mensaje }) {
  return (
    <View className="border border-dashed border-gray-300 rounded-xl px-4 py-5 bg-gray-50 items-center mb-2">
      <Text className="text-gray-400 text-sm text-center leading-5">{mensaje}</Text>
    </View>
  );
}
