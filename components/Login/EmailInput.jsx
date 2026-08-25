import { TextInput } from "react-native";
import { colors } from "../../theme/colors";

export default function EmailInput({ value, onChangeText, focused, setFocused, onSubmitEditing }) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder="Correo electrónico"
      placeholderTextColor={colors.textMuted}
      keyboardType="email-address"
      autoCapitalize="none"
      returnKeyType="next"
      onFocus={() => setFocused("email")}
      onBlur={() => setFocused("")}
      onSubmitEditing={onSubmitEditing}
      className={`w-full bg-white border-2 rounded-2xl px-5 py-4 mb-4 text-text font-sans ${
        focused === "email" ? "border-primary" : "border-gray-300"
      }`}
    />
  );
}
