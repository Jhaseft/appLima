import { useState, useEffect } from "react";
import { View, ScrollView, Switch, Text, Linking } from "react-native";
import FieldWrapper from "./FieldWrapper";
import PasswordInput from "./PasswordInput";
import { colors } from "../../theme/colors";
import API_BASE_URL from "../api";

function PasswordRules({ rules }) {
  return (
    <View className="ml-1 mb-2">
      <Text className={`text-xs font-sans ${rules.digits ? "text-success" : "text-text-muted"}`}>
        • Exactamente 4 dígitos
      </Text>
    </View>
  );
}

export default function Step3Security({ data, setData, errors }) {
  const [password, setPassword] = useState(data.password || "");
  const [confirmPassword, setConfirmPassword] = useState(data.password_confirmation || "");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [rules, setRules] = useState({ digits: false, match: false });

  useEffect(() => {
    setRules({
      digits: /^\d{4}$/.test(password),
      match: password.length > 0 && password === confirmPassword,
    });
  }, [password, confirmPassword]);

  const changePassword = (t) => {
    setPassword(t);
    setData("password", t);
  };
  const changeConfirm = (t) => {
    setConfirmPassword(t);
    setData("password_confirmation", t);
  };
  const openTerms = () => Linking.openURL(`${API_BASE_URL}/politicas`);

  const confirmError =
    !rules.match && confirmPassword.length > 0
      ? "Las contraseñas no coinciden"
      : errors.password_confirmation;

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }} className="px-3">
      <FieldWrapper label="Contraseña *" error={errors.password}>
        <PasswordInput
          value={password}
          onChange={changePassword}
          show={showPassword}
          toggleShow={() => setShowPassword((p) => !p)}
          placeholder="Ingrese su contraseña"
        />
      </FieldWrapper>

      <PasswordRules rules={rules} />

      <FieldWrapper label="Confirmar contraseña *" error={confirmError}>
        <PasswordInput
          value={confirmPassword}
          onChange={changeConfirm}
          show={showConfirm}
          toggleShow={() => setShowConfirm((p) => !p)}
          placeholder="Confirme su contraseña"
        />
      </FieldWrapper>

      <FieldWrapper label="Acepto los términos y condiciones" error={errors.accepted_terms}>
        <View className="flex-row items-center">
          <Switch
            value={data.accepted_terms}
            onValueChange={(v) => setData("accepted_terms", v)}
            trackColor={{ true: colors.primary }}
          />
          <Text className="ml-2 text-text text-sm font-sans">
            Acepto los{" "}
            <Text className="text-primary-dark underline" onPress={openTerms}>
              términos y condiciones
            </Text>
          </Text>
        </View>
      </FieldWrapper>
    </ScrollView>
  );
}
