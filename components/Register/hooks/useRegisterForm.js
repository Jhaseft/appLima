import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { registerUser } from "../services/registerApi";
import { validateStep } from "../validation";

const EMPTY = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  nationality: "",
  document_number: "",
  password: "",
  password_confirmation: "",
  accepted_terms: false,
};

export function useRegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const setData = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const validate = () => {
    const e = validateStep(step, form);
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (validate()) setStep((s) => s + 1);
  };
  const prevStep = () => setStep((s) => s - 1);

  const passwordRules = {
    digits: /^\d{4}$/.test(form.password),
    match: form.password.length > 0 && form.password === form.password_confirmation,
  };
  const canSubmit = passwordRules.digits && passwordRules.match && form.accepted_terms;

  const register = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await registerUser(form);
      Alert.alert("Registro exitoso", data.message);
      router.push({ pathname: "/ConfirmarRegistro", params: { email: form.email } });
    } catch (error) {
      Alert.alert("Error", error.message || "No se pudo conectar al servidor");
    } finally {
      setLoading(false);
    }
  };

  return { step, form, errors, loading, setData, nextStep, prevStep, register, canSubmit };
}
