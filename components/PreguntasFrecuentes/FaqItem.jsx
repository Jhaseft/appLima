import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { colors } from "../../theme/colors";

export default function FaqItem({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <View className="mb-3 border border-border rounded-2xl overflow-hidden">
      <Pressable
        onPress={() => setOpen((v) => !v)}
        className={`flex-row items-center justify-between px-4 py-4 ${open ? "bg-primary" : "bg-background"}`}
      >
        <Text className="text-text font-lm-medium text-sm flex-1 pr-2" style={{ flexShrink: 1 }}>
          {item.pregunta}
        </Text>
        {open ? (
          <ChevronUp size={18} color={colors.text} />
        ) : (
          <ChevronDown size={18} color={colors.textMuted} />
        )}
      </Pressable>

      {open && (
        <View className="px-4 py-4 bg-surface border-t border-border">
          <Text className="text-text-muted text-sm leading-6">{item.respuesta}</Text>
        </View>
      )}
    </View>
  );
}
