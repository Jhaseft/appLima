import "../global.css";
import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter,Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(""); // 👈 para saber qué input está activo

  const passwordRef = useRef(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const user = await AsyncStorage.getItem("user");
        if (token && user) {
          router.replace("/Home");
        }
      } catch (err) {
        console.log("Error revisando sesión:", err);
      }
    };
    checkSession();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Atención", "Por favor, completa todos los campos");
    }

    try {
       setLoading(true);
  let res = await fetch("https://panel.transfercash.click/api/loginapp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  let text = await res.text(); // 👈 leer siempre como texto
  console.log("Respuesta cruda:", text); // 👀 para debug

  let data;
  try {
    data = JSON.parse(text); // 👈 si es JSON válido lo parsea
  } catch (e) {
    throw new Error("El servidor no devolvió JSON, revisa la consola");
  }

  if (res.ok) {
    await AsyncStorage.setItem("token", data.token);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));
    router.replace("/Home");
  } else {
    Alert.alert("Error", data.message || "Credenciales inválidas");
  }
    } catch (error) {
      console.log("Error en login:", error);
      Alert.alert("Error", "No se pudo conectar al servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Stack.Screen
        options={{
          headerShown: true,          // Mostrar el header
          headerTitle: "Transfer Cash", // Título del header
          headerTitleAlign: "center",  // Centrar el título
          headerTintColor: "black",    // Color del texto
        }}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 24 }}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={30}
      >
        {/* Logo */}
        <Image
          source={{
            uri: "https://res.cloudinary.com/dnbklbswg/image/upload/v1756305635/logo_n6nqqr.jpg",
          }}
          className="w-32 h-32 mb-6 self-center"
          resizeMode="contain"
        />

        {/* Título */}
        <Text className="text-4xl font-extrabold text-center text-black mb-8">
          Bienvenido 
        </Text>

        {/* Input email */}
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
          className={`w-full bg-white border-2 rounded-2xl px-5 py-4 mb-4 text-black shadow-md ${
            focused === "email" ? "border-blue-500" : "border-black"
          }`}
        />

        {/* Input contraseña */}
        <View
          className={`flex-row items-center border-2 rounded-2xl px-5 mb-6 bg-white shadow-md ${
            focused === "password" ? "border-blue-500" : "border-black"
          }`}
        >
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
            onSubmitEditing={handleLogin}
            className="flex-1 py-4 text-black"
          />
          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // 👈 más área táctil
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color={focused === "password" ? "#2563EB" : "#555"}
            />
          </TouchableOpacity>
        </View>

        {/* Botón */}
        <Pressable
          onPress={handleLogin}
          disabled={loading}
          className={`w-full py-4 rounded-2xl shadow-lg ${
            loading ? "bg-gray-400" : "bg-black"
          }`}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-center text-white font-bold text-lg">
              Iniciar sesión
            </Text>
          )}
        </Pressable>

        {/* Recuperar contraseña */}
        <TouchableOpacity
          onPress={() => Alert.alert("Info", "Función de recuperar contraseña")}
          className="mt-4"
        >
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
}
