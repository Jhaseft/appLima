import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

// Splash animada: el logo cae desde arriba con rebote y luego el fondo
// se desvanece para revelar la app. Fondo negro para empalmar con el
// splash nativo (app.json) sin corte visible.
export default function AnimatedSplash({ onFinish }) {
  const translateY = useRef(new Animated.Value(-300)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 14,
          speed: 5,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(500),
      Animated.timing(fade, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start(() => onFinish && onFinish());
  }, []);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.container, { opacity: fade }]}>
      <Animated.Image
        source={require("../assets/images/logopro2nobg.png")}
        resizeMode="contain"
        style={[styles.logo, { opacity: logoOpacity, transform: [{ translateY }] }]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  },
  logo: { width: 210, height: 210 },
});
