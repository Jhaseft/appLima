import { useState, useEffect } from "react";
import { View, ScrollView, Switch, Text, Linking, Pressable } from "react-native";
import FieldWrapper from "./FieldWrapper";
import PasswordInput from "./PasswordInput";

function PasswordRules({ rules }) {
  const list = [
    { label: "Mínimo 8 caracteres", valid: rules.length },
    { label: "Una letra mayúscula", valid: rules.upper },
    { label: "Una letra minúscula", valid: rules.lower },
    { label: "Al menos un número", valid: rules.number },
    { label: "Al menos un carácter especial (!@#$%)", valid: rules.special },
  ];

  return (
    <View className="ml-1 flex-row flex-wrap">
      {list.map((rule, i) => (
        <View key={i} className="w-1/2 mb-1">
          <Text className={`text-xs ${rule.valid ? "text-green-500" : "text-gray-400"}`}>
            • {rule.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

export default function Step3Security({ data, setData, errors }) {
  const [password, setPassword] = useState(data.password || "");
  const [confirmPassword, setConfirmPassword] = useState(data.password_confirmation || "");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [rules, setRules] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
    match: false,
  });

  useEffect(() => {
    setRules({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%]/.test(password),
      match: password.length > 0 && password === confirmPassword,
    });
  }, [password, confirmPassword]);

  const handlePasswordChange = (text) => { setPassword(text); setData("password", text); };
  const handleConfirmChange = (text) => { setConfirmPassword(text); setData("password_confirmation", text); };
  const openTerms = () => Linking.openURL("https://panel.transfercash.click/politicas");
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }} className="px-3 ">
      {/* Contraseña */}
      <FieldWrapper label="Contraseña *" error={errors.password}>
        <PasswordInput 
          value={password} 
          onChange={handlePasswordChange} 
          show={showPassword} 
          toggleShow={() => setShowPassword(p => !p)} 
          placeholder="Ingrese su contraseña" 
      
        />
      </FieldWrapper>

      {/* Reglas */}
      <PasswordRules rules={rules} />

      {/* Confirmar contraseña */}
      <FieldWrapper 
        label="Confirmar contraseña *" 
        error={!rules.match && confirmPassword.length > 0 ? "Las contraseñas no coinciden" : errors.password_confirmation}
      >
        <PasswordInput 
          value={confirmPassword} 
          onChange={handleConfirmChange} 
          show={showConfirm} 
          toggleShow={() => setShowConfirm(p => !p)} 
          placeholder="Confirme su contraseña" 
        />
      </FieldWrapper>

      {/* Términos y condiciones */}
      <FieldWrapper label="Acepto los términos y condiciones" error={errors.accepted_terms}>
        <View className="flex-row items-center">
          <Switch value={data.accepted_terms} onValueChange={(v) => setData("accepted_terms", v)} />
          <Text className="ml-2 text-gray-700 text-sm">
            Acepto los{" "}
            <Text 
              className="text-indigo-500 underline active:text-indigo-700" 
              onPress={openTerms}
            >
              términos y condiciones
            </Text>
          </Text>
        </View>
      </FieldWrapper>
    </ScrollView>
  );
}
