import { View, TextInput, Pressable } from "react-native";
import { Send } from "lucide-react-native";
import { colors } from "../../theme/colors";

export default function ChatInput({ input, setInput, loading, onSend }) {
  const activo = input.trim() && !loading;

  return (
    <View className="flex-row items-end px-4 py-3 border-t border-border bg-background gap-3">
      <TextInput
        className="flex-1 bg-surface rounded-2xl px-4 py-3 text-sm text-text max-h-28"
        placeholder="Escribe un mensaje..."
        placeholderTextColor={colors.textMuted}
        value={input}
        onChangeText={setInput}
        multiline
        onSubmitEditing={onSend}
        blurOnSubmit={false}
        editable={!loading}
      />
      <Pressable
        onPress={onSend}
        disabled={!activo}
        className={`w-12 h-12 rounded-full items-center justify-center ${activo ? "bg-primary" : "bg-border"}`}
      >
        <Send size={20} color={activo ? colors.text : colors.textMuted} />
      </Pressable>
    </View>
  );
}
