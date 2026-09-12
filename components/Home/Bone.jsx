import { useEffect, useRef, useState } from "react";
import { Animated, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../theme/colors";

export default function Bone({ className = "", style }) {
  const [width, setWidth] = useState(0);
  const shift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!width) return;
    const loop = Animated.loop(
      Animated.timing(shift, { toValue: 1, duration: 1100, useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, [width, shift]);

  const translateX = shift.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      className={`overflow-hidden rounded-2xl ${className}`}
      style={[{ backgroundColor: colors.border }, style]}
    >
      {width > 0 && (
        <Animated.View
          style={{ position: "absolute", top: 0, bottom: 0, width, transform: [{ translateX }] }}
        >
          <LinearGradient
            colors={["transparent", "rgba(255,255,255,0.9)", "transparent"]}
            locations={[0.35, 0.5, 0.65]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
          />
        </Animated.View>
      )}
    </View>
  );
}
