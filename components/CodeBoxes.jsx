import { useRef } from "react";
import { View, TextInput } from "react-native";

export default function CodeBoxes({ length = 6, value = "", onChange, autoFocus = false }) {
  const inputs = useRef([]);
  const digits = value.split("").slice(0, length);
  while (digits.length < length) digits.push("");

  const setAt = (i, text) => {
    const clean = text.replace(/\D/g, "");
    if (clean.length > 1) {
      const next = clean.slice(0, length);
      onChange(next);
      inputs.current[Math.min(next.length, length - 1)]?.focus();
      return;
    }
    const arr = [...digits];
    arr[i] = clean;
    onChange(arr.join(""));
    if (clean && i < length - 1) inputs.current[i + 1]?.focus();
  };

  const onKey = (i, e) => {
    if (e.nativeEvent.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
      const arr = [...digits];
      arr[i - 1] = "";
      onChange(arr.join(""));
    }
  };

  return (
    <View className="flex-row justify-between">
      {digits.map((d, i) => (
        <TextInput
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          value={d}
          onChangeText={(t) => setAt(i, t)}
          onKeyPress={(e) => onKey(i, e)}
          keyboardType="number-pad"
          maxLength={length}
          autoFocus={autoFocus && i === 0}
          style={{ width: length > 4 ? 46 : 62, height: 60 }}
          className={`border-2 rounded-xl text-center text-2xl font-lm-bold text-text ${
            d ? "border-primary" : "border-gray-300"
          }`}
        />
      ))}
    </View>
  );
}
