import { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRouter, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Step2Extras from "../Register/Step2Extras";
import Step3Security from "../Register/Step3Security";
import API_BASE_URL from "../api";
import { useUser } from "../ContextUser/UserContext";

export default function CompleteProfile() {
  const router = useRouter();
  const { fetchUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    phone: "",
    nationality: "",
    document_number: "",
    password: "",
    password_confirmation: "",
    accepted_terms: false,
  });
  const [errors, setErrors] = useState({});

  const setData = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const passwordRules = {
    digits: /^\d{4}$/.test(form.password),
    match:  form.password.length > 0 && form.password === form.password_confirmation,
  };

  const canSubmit = Object.values(passwordRules).every(Boolean) && form.accepted_terms;

  const validate = () => {
    const e = {};
    const maxPhoneLength = 15;
    // Validar teléfono
  if (!form.phone || form.phone.trim().length < 8) {
    tempErrors.phone = "Teléfono inválido";
  } else if (form.phone.length > maxPhoneLength) {
    tempErrors.phone = `Máximo ${maxPhoneLength} dígitos`;
  } else if (!/^\+?[0-9]+$/.test(form.phone)) {
    tempErrors.phone = "Solo números y + al inicio permitidos";
  }

    if (!form.nationality.trim())
      e.nationality = "Seleccione una nacionalidad";

    if (!form.document_number.trim())
      e.document_number = "Documento requerido";
    else if (form.document_number.length > 20)
      e.document_number = "Máximo 20 caracteres";

    if (!form.password)              e.password = "Contraseña requerida";
    if (!form.password_confirmation) e.password_confirmation = "Confirmación requerida";
    if (!form.accepted_terms)        e.accepted_terms = "Debes aceptar los términos";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/complete-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nationality:       form.nationality,
          phone:             form.phone,
          document_number:   form.document_number,
          terms:             true,
          password:          form.password,
          password_confirmation: form.password_confirmation,
        }),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        await fetchUser();
        Alert.alert("Listo", data.message || "Perfil completado correctamente.");
        router.replace("/Home");
      } else {
        Alert.alert("Error", data.message || "No se pudo completar el perfil");
      }
    } catch {
      Alert.alert("Error", "No se pudo conectar al servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-white px-6 py-10"
      extraScrollHeight={20}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
    >
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Transfer Cash",
          headerTitleAlign: "center",
          headerTintColor: "black",
        }}
      />

      <Text className="text-2xl font-bold mb-2 text-center">Completar perfil</Text>
      <Text className="text-sm text-gray-500 text-center mb-6">
        Necesitamos unos datos más para activar tu cuenta
      </Text>

      <Step2Extras data={form} setData={setData} errors={errors} />
      <Step3Security data={form} setData={setData} errors={errors} />

      <TouchableOpacity
        onPress={canSubmit ? handleSubmit : null}
        disabled={loading || !canSubmit}
        className={`py-4 rounded-2xl mt-2 mb-10 shadow-lg ${loading || !canSubmit ? "bg-gray-400" : "bg-black"}`}
      >
        <Text className="text-center text-white font-bold text-lg ">
          {loading ? "Procesando..." : "Completar perfil"}
        </Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}
