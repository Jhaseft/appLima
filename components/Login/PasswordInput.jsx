import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

export default function PasswordInput({ value, onChangeText, show, setShow, focused, setFocused, inputRef }) {
  const active = focused === "password";
  return (
    <View
      className={`flex-row items-center border-2 rounded-2xl px-5 mb-6 bg-white ${
        active ? "border-primary" : "border-gray-300"
      }`}
    >
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder="Contraseña"
        placeholderTextColor={colors.textMuted}
        secureTextEntry={!show}
        autoCapitalize="none"
        returnKeyType="done"
        onFocus={() => setFocused("password")}
        onBlur={() => setFocused("")}
        className="flex-1 py-4 text-text font-sans"
      />
      <TouchableOpacity
        onPress={() => setShow(!show)}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Ionicons
          name={show ? "eye-off" : "eye"}
          size={24}
          color={active ? colors.primaryDark : colors.textMuted}
        />
      </TouchableOpacity>
    </View>
  );
}
