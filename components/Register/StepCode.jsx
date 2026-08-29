import { useEffect } from "react";
import { View, Text } from "react-native";
import CodeBoxes from "../CodeBoxes";

export default function StepCode({ email, code, setCode, onVerify }) {
  useEffect(() => {
    if (code.length === 6) onVerify(code);
  }, [code]);

  return (
    <View>
      <Text className="text-3xl font-lm-bold text-text mb-2">Verifica tu correo</Text>
      <Text className="text-text-muted font-sans mb-8">
        Ingresa el código de 6 dígitos que enviamos a{" "}
        <Text className="text-text font-lm-medium">{email}</Text>.
      </Text>

      <CodeBoxes length={6} value={code} onChange={setCode} autoFocus />
    </View>
  );
}
