import { useRef } from "react";
import { View, Text, TextInput, Pressable } from "react-native";

const LENGTH = 4;

export default function PasswordInput({ value, onChangeText, inputRef }) {
  const localRef = useRef(null);
  const ref = inputRef ?? localRef;
  const digits = value ?? "";

  const handleChange = (text) =>
    onChangeText(text.replace(/[^0-9]/g, "").slice(0, LENGTH));

  return (
    <View className="mb-6">
      <Text className="text-text-muted font-lm-medium text-sm mb-2">
        Contraseña
      </Text>

      <Pressable
        onPress={() => ref.current?.focus()}
        className="flex-row justify-between"
      >
        {Array.from({ length: LENGTH }).map((_, i) => (
          <View
            key={i}
            className={`w-16 h-16 rounded-2xl border-2 items-center justify-center bg-white ${
              digits.length === i ? "border-primary" : "border-gray-300"
            }`}
          >
            <Text className="text-2xl font-lm-bold text-text">
              {digits[i] ?? ""}
            </Text>
          </View>
        ))}
      </Pressable>

      <TextInput
        ref={ref}
        value={digits}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={LENGTH}
        caretHidden
        textContentType="oneTimeCode"
        pointerEvents="none"
        className="absolute inset-0 opacity-0"
      />
    </View>
  );
}
