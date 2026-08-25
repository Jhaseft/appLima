import { View, TextInput, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

export default function PasswordInput({ value, onChange, show, toggleShow, placeholder }) {
  return (
    <View className="relative w-full">
      <TextInput
        value={value}
        onChangeText={onChange}
        secureTextEntry={!show}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        className="w-full pr-10 py-1 text-text font-sans text-sm"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="numeric"
        maxLength={4}
        textContentType="password"
      />
      <Pressable onPress={toggleShow} className="absolute right-1 top-1" hitSlop={10}>
        <Feather name={show ? "eye-off" : "eye"} size={20} color={colors.textMuted} />
      </Pressable>
    </View>
  );
}
