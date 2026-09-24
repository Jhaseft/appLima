import { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Pressable,
  ScrollView,
  Animated,
  PanResponder,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from "react-native";
import { colors } from "../theme/colors";

// Hoja inferior estandar: entra deslizando desde abajo y se cierra arrastrando
// hacia abajo la LINEA GRIS (asa) del tope; tambien tocando el velo o Cancelar.
// `overlay` es un slot a pantalla completa (ej. ActionOverlay de carga).
const CLOSE_DISTANCE = 110;
const CLOSE_VELOCITY = 0.8;

export default function BottomSheet({ visible, onClose, children, overlay, contentContainerStyle }) {
  const { height } = useWindowDimensions();
  const translateY = useRef(new Animated.Value(height)).current;
  const [render, setRender] = useState(visible);

  useEffect(() => {
    if (visible) {
      setRender(true);
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 2 }).start();
    } else if (render) {
      Animated.timing(translateY, { toValue: height, duration: 220, useNativeDriver: true }).start(
        () => setRender(false)
      );
    }
  }, [visible, height]);

  const springBack = () =>
    Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 2 }).start();

  // El gesto vive solo en el asa: agarras la linea gris y la bajas para controlar
  // la hoja. Asi no compite con el scroll del contenido.
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > CLOSE_DISTANCE || g.vy > CLOSE_VELOCITY) onClose?.();
        else springBack();
      },
      onPanResponderTerminate: springBack,
    })
  ).current;

  if (!render) return null;

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />

        <Animated.View
          style={{ transform: [{ translateY }], maxHeight: height * 0.9 }}
          className="bg-background rounded-t-3xl"
        >
          <View {...pan.panHandlers} className="items-center pt-4 pb-3">
            <View style={{ width: 48, height: 5, backgroundColor: colors.border }} className="rounded-full" />
          </View>

          <ScrollView
            style={{ flexShrink: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={contentContainerStyle}
          >
            {children}
          </ScrollView>
        </Animated.View>

        {overlay}
      </KeyboardAvoidingView>
    </Modal>
  );
}
