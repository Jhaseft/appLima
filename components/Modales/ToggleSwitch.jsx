import { useEffect, useRef } from "react";
import { Animated, Easing, TouchableOpacity, Text } from "react-native";
import { colors } from "../../theme/colors";

// Switch animado reutilizable (juramento / términos, etc.). El padre controla el
// valor; el switch anima para reflejarlo.
export default function ToggleSwitch({ value, onToggle, children }) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.circle),
      useNativeDriver: false,
    }).start();
  }, [value]);

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [2, 22] });
  const backgroundColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.primaryAccent],
  });

  return (
    <TouchableOpacity onPress={onToggle} className="flex-row items-center gap-3">
      <Animated.View className="w-11 h-6 rounded-full p-1 justify-center" style={{ backgroundColor }}>
        <Animated.View
          className="w-5 h-5 rounded-full bg-background shadow"
          style={{ transform: [{ translateX }] }}
        />
      </Animated.View>
      <Text className="text-text-muted font-sans text-sm flex-1">{children}</Text>
    </TouchableOpacity>
  );
}
