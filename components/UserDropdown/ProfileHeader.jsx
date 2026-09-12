import { Animated, View, Text } from "react-native";
import { UserRoundCog, Star } from "lucide-react-native";
import { colors } from "../../theme/colors";

export default function ProfileHeader({ user, scrollY, settled }) {
  const opacity = scrollY.interpolate({
    inputRange: [0, 90],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const translateY = scrollY.interpolate({
    inputRange: [0, 90],
    outputRange: [0, -20],
    extrapolate: "clamp",
  });

  const nombre = user
    ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim().toUpperCase()
    : "";

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }} className="px-5 pt-2 pb-4">
      <View className="w-24 h-24 rounded-full bg-surface border border-border items-center justify-center self-start">
        {settled ? <UserRoundCog size={54} color={colors.text} /> : null}
      </View>

      <Text className="text-text text-2xl font-lm-bold mt-4">{nombre}</Text>

    </Animated.View>
  );
}
