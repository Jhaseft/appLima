import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../../ContextUser/UserContext";
import { registerForPushNotifications } from "../../../utils/notifications";
import { sendRegister, verifyCode } from "../services/registerApi";

const PHASES = ["email", "password", "code"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useRegisterFlow() {
  const router = useRouter();
  const { fetchUser } = useUser();
  const [phase, setPhase] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const step = PHASES.indexOf(phase) + 1;
  const emailValid = EMAIL_RE.test(email.trim());
  const passwordValid = password.length === 4 && password === confirm;

  const back = () => {
    const i = PHASES.indexOf(phase);
    if (i > 0) setPhase(PHASES[i - 1]);
    else router.back();
  };

  const goToPassword = () => {
    if (emailValid) setPhase("password");
  };

  const submitRegister = async () => {
    if (!passwordValid) return;
    try {
      setLoading(true);
      await sendRegister(email.trim(), password);
      setCode("");
      setPhase("code");
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  const verify = async (fullCode) => {
    try {
      setLoading(true);
      const data = await verifyCode(email.trim(), fullCode);
      await AsyncStorage.setItem("token", data.token);
      await fetchUser(data.user);
      registerForPushNotifications();
      router.replace("/CompleteProfile");
    } catch (e) {
      Alert.alert("Error", e.message);
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  return {
    phase,
    step,
    email,
    setEmail,
    emailValid,
    password,
    setPassword,
    confirm,
    setConfirm,
    passwordValid,
    code,
    setCode,
    loading,
    back,
    goToPassword,
    submitRegister,
    verify,
  };
}
