import { View, Text } from "react-native";
import { Bot } from "lucide-react-native";
import { colors } from "../../theme/colors";

export default function MessageBubble({ message }) {
  const esUser = message.role === "user";

  return (
    <View className={`mb-3 max-w-[80%] ${esUser ? "self-end" : "self-start"}`}>
      {!esUser && (
        <View className="flex-row items-center gap-1 mb-1">
          <Bot size={14} color={colors.primaryAccent} />
          <Text className="text-primary-accent text-xs font-lm-medium">Asistente</Text>
        </View>
      )}
      <View className={`px-4 py-3 rounded-2xl ${esUser ? "bg-primary rounded-tr-sm" : "bg-surface rounded-tl-sm"}`}>
        <Text className={`text-sm leading-5 ${esUser ? "text-text font-lm-medium" : "text-text"}`}>
          {message.text}
        </Text>
      </View>
    </View>
  );
}
