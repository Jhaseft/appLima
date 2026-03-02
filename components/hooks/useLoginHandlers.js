import { useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useUser } from "../ContextUser/UserContext";
import API_BASE_URL from "../api";

export function useLoginHandlers(email, password) {
  const router = useRouter();
  const { fetchUser } = useUser();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Atención", "Completa todos los campos");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/loginapp`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const contentType = res.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new Error("El servidor devolvió HTML en lugar de JSON");
      }
      const data = await res.json();
      if (!res.ok) {
        Alert.alert("Error", data.message || "Credenciales inválidas");
        return;
      }
      await AsyncStorage.setItem("token", data.token);
      await fetchUser(data.user);
      router.replace("/Home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      GoogleSignin.configure({
        webClientId: "269848220574-1u99j5vsj8p9m7v6kg21p1ion00n422s.apps.googleusercontent.com",
        offlineAccess: false,
        iosClientId: "269848220574-u1nncraprer9mf731ibf7j77dsjp2r47.apps.googleusercontent.com",
      });
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const response = await GoogleSignin.signIn();
      if (response.type !== "success") {
        if (response.type !== "cancelled") {
          Alert.alert("Error", "No se pudo completar el inicio de sesión con Google");
        }
        return;
      }
      const { idToken } = response.data;
      if (!idToken) {
        Alert.alert("Error", "No se recibió idToken de Google");
        return;
      }
      const res = await fetch(`${API_BASE_URL}/api/logingoogle`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const contentType = res.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new Error("El servidor devolvió HTML en lugar de JSON");
      }
      const data = await res.json();
      if (!res.ok) {
        Alert.alert("Error", data.message || "No se pudo iniciar sesión con Google");
        return;
      }
      await AsyncStorage.setItem("token", data.token);
      await fetchUser(data.user);
      router.replace(data.needs_profile ? "/CompleteProfile" : "/Home");
    } catch (error) {
      Alert.alert("Error", error?.message || "Error al iniciar sesión con Google");
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, handleGoogleLogin, loading };
}
