import { useEffect, useRef } from "react";
import { Animated, Text, View, Pressable } from "react-native";
import { TrendingUp } from "lucide-react-native";
import { colors } from "../../theme/colors";

export default function RateChangeBanner({ notice, onHide }) {
  const y = useRef(new Animated.Value(-140)).current;

  useEffect(() => {
    if (!notice) return;
    Animated.spring(y, { toValue: 0, useNativeDriver: true, tension: 60, friction: 11 }).start();
    const timer = setTimeout(hide, 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  const hide = () => {
    Animated.timing(y, { toValue: -140, duration: 250, useNativeDriver: true }).start(
      () => onHide && onHide()
    );
  };

  if (!notice) return null;

  return (
    <Animated.View
      style={{ transform: [{ translateY: y }] }}
      className="absolute top-2 left-4 right-4 z-50"
    >
      <Pressable
        onPress={hide}
        className="flex-row items-center gap-3 bg-primary rounded-2xl px-4 py-3 shadow"
      >
        <View className="w-9 h-9 rounded-full bg-primary-light items-center justify-center">
          <TrendingUp size={18} color={colors.primaryDark} />
        </View>
        <View className="flex-1">
          <Text className="text-text font-lm-bold text-sm">El tipo de cambio se actualizó</Text>
          <Text className="text-text font-sans text-xs mt-0.5">
            Se aplicará el último: Compra {notice.compra} · Venta {notice.venta}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}
