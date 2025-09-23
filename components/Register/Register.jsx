import { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRouter,Stack } from "expo-router";
import Step1Personal from "./Step1Personal";
import Step2Extras from "./Step2Extras";
import Step3Security from "./Step3Security";
import ProgressBar from "./ProgressBar";

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    nationality: "",
    document_number: "",
    password: "",
    password_confirmation: "",
    accepted_terms: false,
  });
  const [errors, setErrors] = useState({});

  const setData = (field, value) => setForm({ ...form, [field]: value });

  const prevStep = () => setStep(step - 1);
  const nextStep = () => { if (validateStep()) setStep(step + 1); };

  // Validación simple por paso
  const validateStep = () => {
    const tempErrors = {};
    if (step === 1) {
      if (!form.first_name.trim()) tempErrors.first_name = "Requerido";
      if (!form.last_name.trim()) tempErrors.last_name = "Requerido";
      if (!form.email.trim()) tempErrors.email = "Requerido";
    }
    if (step === 2) {
      if (!form.phone || form.phone.length < 8) tempErrors.phone = "Teléfono inválido";
      if (!form.nationality.trim()) tempErrors.nationality = "Seleccione una nacionalidad";
      if (!form.document_number.trim()) tempErrors.document_number = "Documento requerido";
    }
    if (step === 3) {
      if (!form.password) tempErrors.password = "Contraseña requerida";
      if (!form.password_confirmation) tempErrors.password_confirmation = "Confirmación requerida";
      if (!form.accepted_terms) tempErrors.accepted_terms = "Debes aceptar los términos";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const register = async () => {
    if (!validateStep()) return;
    setLoading(true);
    try {
      const res = await fetch("https://panel.transfercash.click/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok && data.status === "success") {
        Alert.alert("Registro exitoso", data.message);
        router.push({
          pathname: "/ConfirmarRegistro",
          params: { email: form.email },
        });

      } else {
        Alert.alert("Error", data.message || "No se pudo completar el registro");
      }
    } catch {
      setLoading(false);
      Alert.alert("Error", "No se pudo conectar al servidor");
    }
  };

  const passwordRules = {
    length: form.password.length >= 8,
    upper: /[A-Z]/.test(form.password),
    lower: /[a-z]/.test(form.password),
    number: /\d/.test(form.password),
    special: /[!@#$%]/.test(form.password),
    match: form.password === form.password_confirmation,
  };

  const canSubmit = Object.values(passwordRules).every(Boolean) && form.accepted_terms;

  return (
    <KeyboardAwareScrollView className="flex-1 bg-white px-6 py-10" extraScrollHeight={20} enableOnAndroid>
      
<Stack.Screen
        options={{
          headerShown: true,          // Mostrar el header
          headerTitle: "Transfer Cash", // Título del header
          headerTitleAlign: "center",  // Centrar el título
          headerTintColor: "black",    // Color del texto
        }}
      />

      <Text className="text-2xl font-bold mb-6 text-center">Crear una cuenta</Text>
      <ProgressBar step={step} totalSteps={3} />

      <View className="space-y-6">
        {step === 1 && <Step1Personal data={form} setData={setData} errors={errors} />}
        {step === 2 && <Step2Extras data={form} setData={setData} errors={errors} />}
        {step === 3 && <Step3Security data={form} setData={setData} errors={errors} />}
      </View>

      <View className="flex-row justify-between mt-6">
        {step > 1 && (
          <TouchableOpacity onPress={prevStep} className="bg-black py-3 px-6 rounded-xl">
            <Text className="text-white font-bold">Anterior</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={step < 3 ? nextStep : canSubmit ? register : null}
          className={`py-3 px-6 rounded-xl ${loading || (!canSubmit && step === 3) ? "bg-gray-400" : "bg-black"}`}
          disabled={loading || (!canSubmit && step === 3)}
        >
          <Text className="text-white font-bold">{loading ? "Procesando..." : step < 3 ? "Siguiente" : "Finalizar "}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}
