import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import { useUser } from "../ContextUser/UserContext";
import { useFeedback } from "../Feedback/FeedbackContext";
import { registerForPushNotifications } from "../../utils/notifications";
import { loginWithEmail, loginWithGoogle, loginWithApple } from "../services/authApi";
import { routeForUser } from "../profileStatus";

export function useLoginHandlers(email, password) {
  const router = useRouter();
  const { fetchUser } = useUser();
  const feedback = useFeedback();

  // Apple (guía 5.1.1) no permite forzar "Completar perfil" al iniciar sesión.
  // Se entra siempre a Home; el perfil se exige al operar (ver Cotiza.jsx).
  const enter = async (data) => {
    await AsyncStorage.setItem("token", data.token);
    await fetchUser(data.user);
    registerForPushNotifications();
    router.replace(routeForUser(data.user));
  };

  const handleLogin = async () => {
    if (!email || !password) {
      feedback.info("Completa todos los campos", { title: "Atención" });
      return;
    }
    try {
      await enter(await loginWithEmail(email, password));
    } catch (error) {
      feedback.error(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        offlineAccess: false,
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      });
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const response = await GoogleSignin.signIn();
      if (response.type !== "success") {
        if (response.type !== "cancelled") {
          feedback.error("No se pudo completar el inicio de sesión con Google");
        }
        return;
      }
      const { idToken } = response.data;
      if (!idToken) {
        feedback.error("No se recibió idToken de Google");
        return;
      }
      await enter(await loginWithGoogle(idToken));
    } catch (error) {
      feedback.error(error?.message || "Error al iniciar sesión con Google");
    }
  };

  const handleAppleLogin = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const { identityToken, fullName, email: appleEmail, user } = credential;
      if (!identityToken) {
        feedback.error("No se recibió el token de Apple");
        return;
      }
      await enter(
        await loginWithApple({
          identityToken,
          appleUserId: user,
          email: appleEmail ?? null,
          firstName: fullName?.givenName ?? null,
          lastName: fullName?.familyName ?? null,
        })
      );
    } catch (error) {
      if (error?.code === "ERR_REQUEST_CANCELED") return;
      feedback.error(error?.message || "Error al iniciar sesión con Apple");
    }
  };

  return { handleLogin, handleGoogleLogin, handleAppleLogin };
}
