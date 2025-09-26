// app/Login.jsx
import "../global.css";
import { useState, useRef, memo } from "react";
import { View, Text, TextInput, Pressable, Image, Alert, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../components/ContextUser/UserContext";

// Componente memoizado para evitar re-renders innecesarios
const PasswordInput = memo(({ password, setPassword, showPassword, setShowPassword, focused, setFocused, passwordRef }) => (
  <View className={`flex-row items-center border-2 rounded-2xl px-5 mb-6 bg-white shadow-md ${focused === "password" ? "border-blue-500" : "border-black"}`}>
    <TextInput
      ref={passwordRef}
      value={password}
      onChangeText={setPassword}
      placeholder="Contraseña"
      placeholderTextColor="#888"
      secureTextEntry={!showPassword}
      autoCapitalize="none"
      returnKeyType="done"
      onFocus={() => setFocused("password")}
      onBlur={() => setFocused("")}
      className="flex-1 py-4 text-black"
    />
    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
      <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color={focused === "password" ? "#2563EB" : "#555"} />
    </TouchableOpacity>
  </View>
));

export default function Login() {
  const router = useRouter();
  const { fetchUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState("");
  const passwordRef = useRef(null);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Atención", "Completa todos los campos");

    try {
      setLoading(true);
      const res = await fetch("https://panel.transfercash.click/api/loginapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } 
      catch (e) { throw new Error("Servidor no devolvió JSON"); }

      if (res.ok) {
        await AsyncStorage.setItem("token", data.token);
        await fetchUser(data.user);
        router.replace("/Home");
      } else {
        Alert.alert("Error", data.message || "Credenciales inválidas");
      }
    } catch (error) {
      console.log("Error login:", error);
      Alert.alert("Error", "No se pudo conectar al servidor");
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-white" behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Stack.Screen options={{ headerShown: true, headerTitle: "Transfer Cash", headerTitleAlign: "center", headerTintColor: "black" }} />
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 24 }} enableOnAndroid keyboardShouldPersistTaps="handled" extraScrollHeight={30}>
        <Image source={{ uri: "https://res.cloudinary.com/dnbklbswg/image/upload/v1756305635/logo_n6nqqr.jpg" }} className="w-32 h-32 mb-6 self-center" resizeMode="contain" />
        <Text className="text-4xl font-extrabold text-center text-black mb-8">Bienvenido</Text>

        {/* Input de email */}
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Correo electrónico"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
          onFocus={() => setFocused("email")}
          onBlur={() => setFocused("")}
          onSubmitEditing={() => passwordRef.current.focus()}
          className={`w-full bg-white border-2 rounded-2xl px-5 py-4 mb-4 text-black shadow-md ${focused === "email" ? "border-blue-500" : "border-black"}`}
        />

        {/* Input de contraseña */}
        <PasswordInput
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          focused={focused}
          setFocused={setFocused}
          passwordRef={passwordRef}
        />

        {/* Botón de login */}
        <Pressable onPress={handleLogin} disabled={loading} className={`w-full py-4 rounded-2xl shadow-lg ${loading ? "bg-gray-400" : "bg-black"}`}>
          {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text className="text-center text-white font-bold text-lg">Iniciar sesión</Text>}
        </Pressable>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
}
