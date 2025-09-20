import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function ConfirmarRegistro() {
  const router = useRouter();
  const { email } = useLocalSearchParams(); // Aquí ya funciona en móvil
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyCode = async () => {
    if (code.length !== 6) return Alert.alert("Código inválido", "El código debe tener 6 dígitos");
    setLoading(true);
    try {
      const res = await fetch("https://panel.transfercash.click/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok && data.status === "success") {
        Alert.alert("¡Cuenta activada!", data.message);
        router.replace("/Login");
      } else {
        Alert.alert("Error", data.message || "Código incorrecto");
      }
    } catch (e) {
      setLoading(false);
      Alert.alert("Error", "No se pudo conectar al servidor");
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-2xl font-bold mb-6 text-center">Confirmar Registro</Text>
      <Text className="mb-4 text-center text-gray-700">
        Ingresa el código que te enviamos a tu correo: {email}
      </Text>

      <TextInput
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
        maxLength={6}
        className="border-2 border-gray-300 rounded-xl px-4 py-3 text-center text-xl mb-4"
        placeholder="Código de 6 dígitos"
      />

      <TouchableOpacity
        onPress={verifyCode}
        className={`py-3 rounded-xl ${loading ? "bg-gray-400" : "bg-black"}`}
        disabled={loading}
      >
        <Text className="text-white text-center font-bold">{loading ? "Verificando..." : "Confirmar"}</Text>
      </TouchableOpacity>
    </View>
  );
}
