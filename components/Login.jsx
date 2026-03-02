// app/Login.jsx
import "../global.css";
import { useState, useRef, memo } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Linking
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Stack, Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import GoogleBotoon from "./GoogleBoton";
import { useLoginHandlers } from "./hooks/useLoginHandlers";

// Componente memoizado para el input de contraseña
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState("");
  const passwordRef = useRef(null);

  const { handleLogin, handleGoogleLogin, loading } = useLoginHandlers(email, password);


  return (
    <KeyboardAvoidingView className="flex-1 bg-white" behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Stack.Screen options={{ headerShown: true, headerTitle: "Transfer Cash", headerTitleAlign: "center", headerTintColor: "black" }} />
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 24 }} enableOnAndroid keyboardShouldPersistTaps="handled" extraScrollHeight={30}>
        <Image source={{ uri: "https://res.cloudinary.com/dnbklbswg/image/upload/v1756305635/logo_n6nqqr.jpg" }} className="w-32 h-32 mb-6 self-center" resizeMode="contain" />
        <Text className="text-4xl font-extrabold text-center text-black mb-8">Bienvenido</Text>

      
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

       
        <PasswordInput
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          focused={focused}
          setFocused={setFocused}
          passwordRef={passwordRef}
        />

       
        <Pressable
          onPress={handleLogin}
          disabled={loading}
          className={`w-full py-4 rounded-2xl shadow-lg ${loading ? "bg-gray-400" : "bg-black"}`}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-center text-white font-bold text-lg">Iniciar sesión</Text>
          )}
        </Pressable>

          <GoogleBotoon handleGoogleLogin={handleGoogleLogin}/>

        <View className="mt-4 w-full flex-row justify-center">
          
          <TouchableOpacity onPress={() => Linking.openURL("https://transfercash.click/forgot-password")}>
            <Text className="text-blue-600 font-semibold ">Olvidé mi contraseña</Text>
          </TouchableOpacity>
        </View>


        <View className="mt-6 flex-row justify-center">
          <Text className="text-black mr-1">¿No tienes cuenta?</Text>
          <Link asChild href="/Register">
            <Text className="text-blue-600 font-semibold">Regístrate aquí</Text>
          </Link>
        </View>

      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
}
