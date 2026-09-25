import { useState, useEffect } from "react";
import { View } from "react-native";

export default function TypingIndicator() {
  const [dot, setDot] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setDot((d) => (d + 1) % 3), 500);
    return () => clearInterval(t);
  }, []);

  return (
    <View className="flex-row items-center gap-1 px-4 py-2">
      {[0, 1, 2].map((i) => (
        <View key={i} style={{ opacity: dot === i ? 1 : 0.3 }} className="w-2 h-2 rounded-full bg-primary" />
      ))}
    </View>
  );
}
