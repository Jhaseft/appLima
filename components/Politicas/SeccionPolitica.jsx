import { View, Text } from "react-native";

export default function SeccionPolitica({ titulo, contenido }) {
  return (
    <View className="mb-6">
      <Text className="text-text text-base font-lm-bold mb-2">{titulo}</Text>
      <Text className="text-text-muted text-sm leading-6">{contenido}</Text>
    </View>
  );
}
