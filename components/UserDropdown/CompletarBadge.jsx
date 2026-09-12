import { useEffect, useRef } from "react";
import { Animated, Text } from "react-native";

export default function CompletarBadge({ label = "Completar" }) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.3, duration: 650, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 650, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      style={{ opacity: pulse }}
      className="bg-danger rounded-full px-3 py-1 mr-2"
    >
      <Text className="text-white text-xs font-lm-bold">{label}</Text>
    </Animated.View>
  );
}
