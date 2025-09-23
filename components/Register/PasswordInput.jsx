import { View, TextInput, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function PasswordInput({
  value,
  onChange,
  show,
  toggleShow,
  placeholder,
}) {
  return (
    <View className="relative w-full">
      <TextInput
        value={value}
        onChangeText={onChange}
        secureTextEntry={!show}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-10 text-gray-900 text-sm"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="default"
        textContentType="password"
        placeholderTextColor="#9CA3AF"
      />
      <Pressable
        onPress={toggleShow}
        className="absolute right-3 top-3"
        hitSlop={10}
      >
        <Feather
          name={show ? "eye-off" : "eye"}
          size={20}
          color="gray"
        />
      </Pressable>
    </View>
  );
}
