import { useRef } from "react";
import { Text, TouchableOpacity, Animated } from "react-native";

export default function BotonItem({ btn, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();

  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={() => onPress(btn)}
        onPressIn={pressIn}
        onPressOut={pressOut}
        className={`w-28 h-28 rounded-2xl items-center justify-center ${btn.bg}`}
      >
        <btn.Icon size={32} color={btn.color} />
        <Text className="mt-2 text-sm font-lm-medium text-text text-center">
          {btn.label1}
        </Text>
        <Text className="text-sm font-lm-medium text-text text-center">
          {btn.label2}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
