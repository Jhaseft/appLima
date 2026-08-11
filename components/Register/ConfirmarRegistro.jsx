import { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, ActivityIndicator, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import API_BASE_URL from "../api";

const LENGTH = 6;

export default function ConfirmarRegistro() {
  const router = useRouter();
  const { email } = useLocalSearchParams(); // viene de la pantalla anterior
  const [digits, setDigits] = useState(Array(LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);
  const submitted = useRef(false);

  // Foco inicial en la primera casilla.
  useEffect(() => {
    const t = setTimeout(() => inputs.current[0]?.focus(), 300);
    return () => clearTimeout(t);
  }, []);

  // Al completar los 6 dígitos → verificar solo (sin botón).
  useEffect(() => {
    const code = digits.join("");
    if (code.length === LENGTH && !digits.includes("") && !submitted.current) {
      submitted.current = true;
      verifyCode(code);
    }
  }, [digits]);

  const setDigit = (index, value) => {
    const clean = value.replace(/\D/g, "");

    // Si pegaron varios dígitos, repartirlos en las casillas.
    if (clean.length > 1) {
      const next = Array(LENGTH).fill("");
      for (let i = 0; i < clean.length && i < LENGTH; i++) next[i] = clean[i];
      setDigits(next);
      const focusIndex = Math.min(clean.length, LENGTH - 1);
      inputs.current[focusIndex]?.focus();
      return;
    }

    setDigits((prev) => {
      const nextArr = [...prev];
      nextArr[index] = clean;
      return nextArr;
    });

    if (clean && index < LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index, e) => {
    if (e.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
      setDigits((prev) => {
        const nextArr = [...prev];
        nextArr[index - 1] = "";
        return nextArr;
      });
    }
  };

  const resetCode = () => {
    submitted.current = false;
    setDigits(Array(LENGTH).fill(""));
    inputs.current[0]?.focus();
  };

  const verifyCode = async (code) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok && data.status === "success") {
        Alert.alert("¡Cuenta activada!", data.message);
        router.replace("/Login");
      } else {
        Alert.alert("Error", data.message || "Código incorrecto");
        resetCode();
      }
    } catch (e) {
      setLoading(false);
      Alert.alert("Error", "No se pudo conectar al servidor");
      resetCode();
    }
  };

  return (
    <View className="flex-1 min-h-screen justify-center px-6 bg-white">
      <Text className="text-2xl font-bold mb-3 text-center">Confirmar Registro</Text>
      <Text className="mb-8 text-center text-gray-700">
        Ingresa el código que te enviamos a tu correo: {email}
      </Text>

      <View className="flex-row justify-center items-center gap-2 mb-60">
        {digits.map((digit, index) => (
          <TextInput
            key={index}
            ref={(el) => (inputs.current[index] = el)}
            value={digit}
            onChangeText={(value) => setDigit(index, value)}
            onKeyPress={(e) => handleKeyPress(index, e)}
            keyboardType="number-pad"
            maxLength={LENGTH} // permite pegar el código completo
            editable={!loading}
            className="border-2 border-gray-300 rounded-xl w-12 h-14 text-center text-2xl font-bold"
          />
        ))}
      </View>

      {loading && (
        <View className="flex-row items-center justify-center mt-2">
          <ActivityIndicator />
          <Text className="ml-2 text-gray-600">Verificando...</Text>
        </View>
      )}
    </View>
  );
}
