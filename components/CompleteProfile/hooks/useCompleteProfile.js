import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../../ContextUser/UserContext";
import { completeProfile } from "../services/profileApi";

const EMPTY = {
  first_name: "",
  last_name: "",
  phone: "",
  nationality: "",
  document_number: "",
  password: "",
  password_confirmation: "",
  accepted_terms: false,
};

export function useCompleteProfile() {
  const router = useRouter();
  const { user, fetchUser } = useUser();
  const requirePassword = !user?.has_password;

  const subSteps = requirePassword
    ? ["personal", "extra", "security"]
    : ["personal", "extra"];

  const [index, setIndex] = useState(0);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        first_name: user.first_name || "",
        last_name: user.last_name || "",
      }));
    }
  }, [user]);

  const subStep = subSteps[index];
  const isLast = index === subSteps.length - 1;
  // El macro-paso 1 (credenciales) ya está hecho al llegar aquí.
  const macroCurrent = index + 2;

  const setData = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const validateStep = () => {
    const e = {};
    if (subStep === "personal") {
      if (!form.first_name.trim()) e.first_name = "Requerido";
      if (!form.last_name.trim()) e.last_name = "Requerido";
    }
    if (subStep === "extra") {
      if (!form.phone || form.phone.trim().length < 8) e.phone = "Teléfono inválido";
      if (!form.nationality.trim()) e.nationality = "Seleccione una nacionalidad";
      if (!form.document_number.trim()) e.document_number = "Documento requerido";
    }
    if (subStep === "security") {
      if (!/^\d{4}$/.test(form.password)) e.password = "4 dígitos";
      if (form.password !== form.password_confirmation) e.password_confirmation = "No coincide";
      if (!form.accepted_terms) e.accepted_terms = "Debes aceptar los términos";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const body = {
        first_name: form.first_name,
        last_name: form.last_name,
        nationality: form.nationality,
        phone: form.phone,
        document_number: form.document_number,
        terms: true,
      };
      if (requirePassword) {
        body.password = form.password;
        body.password_confirmation = form.password_confirmation;
      }
      await completeProfile(token, body);
      await fetchUser();
      router.replace("/Home");
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    if (!validateStep()) return;
    if (isLast) submit();
    else setIndex((i) => i + 1);
  };

  const back = () => {
    if (index > 0) setIndex((i) => i - 1);
  };

  return {
    subStep,
    index,
    isLast,
    macroCurrent,
    requirePassword,
    form,
    errors,
    loading,
    setData,
    next,
    back,
  };
}
