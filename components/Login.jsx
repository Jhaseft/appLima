import "../global.css";
import { useState, useEffect } from "react";
import {
  View, Text, TextInput, Pressable, Image, Alert, Platform
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import { useRouter } from "expo-router";

WebBrowser.maybeCompleteAuthSession(); // <- importante, al tope del archivo

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // genera y muestra para debug el redirectUri que se usará
  const redirectUri = makeRedirectUri({
    scheme: "transfercash",
    // preferLocalhost: false // si usas localhost en web
  });
  console.log("Redirect URI (para registrar en GCP o debug):", redirectUri);

  // useIdTokenAuthRequest o useAuthRequest con responseType: 'id_token'
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "269848220574-gmmo62t5ft34s2ijmdmi9btvk0v74c1a.apps.googleusercontent.com", // webClientId (expoClientId)
    iosClientId: "269848220574-4dv9h2d395nqgsu7sc9uvl2q0n44beou.apps.googleusercontent.com",
    androidClientId: "269848220574-u8lvqdnimlf0ge1376r9ic1eab1kg9r6.apps.googleusercontent.com",
    redirectUri,
  });

  // Login normal (usuario + contraseña)
  const handleLogin = async () => {
    try {
      let res = await fetch("http://192.168.1.11:8000/api/loginapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data = await res.json();
      console.log("Respuesta:", data);

      if (res.ok) {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        router.replace("/home");
      } else {
        Alert.alert("Error", data.message || "Credenciales inválidas");
      }
    } catch (error) {
      console.log("Error en login:", error);
      Alert.alert("Error", "No se pudo conectar al servidor");
    }
  };

  // Login con Google -> maneja response
  useEffect(() => {
    (async () => {
      if (response?.type === "success") {
        // idToken puede venir en response.authentication.idToken o response.params.id_token
        const idToken =
          response.authentication?.idToken ?? response.params?.id_token;

        console.log("Google ID Token (idToken):", idToken, "full response:", response);

        if (!idToken) {
          Alert.alert("Error Google", "No se recibió idToken. Revisa configuración de clientes en Google Console.");
          return;
        }

        try {
          const res = await fetch("http://192.168.1.11:8000/api/login-google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: idToken }),
          });

          const data = await res.json();
          console.log("Respuesta Google backend:", data);
          if (data.token) {
            await AsyncStorage.setItem("token", data.token);
            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            router.replace("/home");
          } else {
            Alert.alert("Error Google", data.message || "Fallo al iniciar sesión");
          }
        } catch (err) {
          console.log(err);
          Alert.alert("Error", "No se pudo conectar con el backend");
        }
      }
    })();
  }, [response]);

  return (
    <View className="flex-1 bg-white px-6">
       <Image
        source={{
          uri: "https://res.cloudinary.com/dnbklbswg/image/upload/v1756305635/logo_n6nqqr.jpg",
        }}
        className="w-32 h-32 mb-6 self-center"
        resizeMode="contain"
      />
      <Text className="text-4xl font-extrabold text-center text-black mb-8">
        Bienvenido
      </Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Correo electrónico"
        placeholderTextColor="#888"
        keyboardType="email-address"
        className="w-full bg-white border-2 border-black shadow-md rounded-2xl px-5 py-4 mb-4 text-black"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Contraseña"
        placeholderTextColor="#888"
        secureTextEntry
        className="w-full bg-white border-2 border-black shadow-md rounded-2xl px-5 py-4 mb-6 text-black"
      />

      <Pressable
        disabled={!request}
        onPress={() =>
          // si estás en Expo Go usa useProxy: true, en devbuild/EAS usa useProxy: false
          promptAsync({ useProxy: false }).catch((err) => console.log(err))
        }
        className="w-full bg-red-500 py-4 rounded-2xl shadow-lg active:opacity-70"
      >
        <Text className="text-center text-white font-bold text-lg">
          Iniciar sesión con Google
        </Text>
      </Pressable>
    </View>
  );
}
