import { useState } from "react";
import { View, Switch, Text, Linking } from "react-native";
import CodeBoxes from "../CodeBoxes";
import { colors } from "../../theme/colors";
import API_BASE_URL from "../api";

export default function Step3Security({ data, setData, errors, requirePassword = true }) {
  const [password, setPassword] = useState(data.password || "");
  const [confirmPassword, setConfirmPassword] = useState(data.password_confirmation || "");

  const changePassword = (t) => {
    setPassword(t);
    setData("password", t);
  };
  const changeConfirm = (t) => {
    setConfirmPassword(t);
    setData("password_confirmation", t);
  };
  const openTerms = () => Linking.openURL(`${API_BASE_URL}/politicas`);

  const mismatch = confirmPassword.length === 4 && password !== confirmPassword;

  return (
    <View>
      {requirePassword ? (
        <>
          <Text className="text-text font-lm-medium mb-3">Contraseña (4 dígitos)</Text>
          <CodeBoxes length={4} value={password} onChange={changePassword} />
          {errors.password ? (
            <Text className="text-danger text-xs mt-2 font-sans">{errors.password}</Text>
          ) : null}

          <Text className="text-text font-lm-medium mb-3 mt-6">Confirma tu contraseña</Text>
          <CodeBoxes length={4} value={confirmPassword} onChange={changeConfirm} />
          {mismatch ? (
            <Text className="text-danger text-xs mt-2 font-sans">Las contraseñas no coinciden.</Text>
          ) : null}
        </>
      ) : null}

      <View className="flex-row items-center mt-8">
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
      {errors.accepted_terms ? (
        <Text className="text-danger text-xs mt-2 font-sans">{errors.accepted_terms}</Text>
      ) : null}
    </View>
  );
}
