import { useEffect, useState } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import LottieView from "lottie-react-native";
import { subscribe, getActive } from "./services/loadingStore";

export default function LoadingOverlay() {
  const [active, setActive] = useState(getActive());
  const { width } = useWindowDimensions();

  useEffect(() => subscribe(setActive), []);

  if (active <= 0) return null;

  const size = width * 0.6;

  return (
    <View style={[StyleSheet.absoluteFill, styles.overlay]}>
      <LottieView
        source={require("../assets/animations/loader.json")}
        autoPlay
        loop
        style={{ width: size, height: size * (1080 / 1920) }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(255,255,255,0.75)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 40,
  },
});
