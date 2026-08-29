import { Pressable, Text } from "react-native";

export default function SubmitButton({ onPress, label }) {
  return (
    <Pressable
      onPress={onPress}
      className="w-full py-4 rounded-2xl shadow bg-primary active:opacity-80"
    >
      <Text className="text-center text-text font-lm-bold text-lg">{label}</Text>
    </Pressable>
  );
}
