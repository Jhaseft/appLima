import { Pressable, Text, ActivityIndicator } from "react-native";
import { colors } from "../../theme/colors";

export default function SubmitButton({ onPress, loading, label }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      className={`w-full py-4 rounded-2xl shadow bg-primary ${
        loading ? "opacity-60" : "active:opacity-80"
      }`}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.text} />
      ) : (
        <Text className="text-center text-text font-lm-bold text-lg">{label}</Text>
      )}
    </Pressable>
  );
}
