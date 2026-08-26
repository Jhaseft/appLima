import { View, Text, Pressable } from "react-native";
import CodeBoxes from "../CodeBoxes";

export default function StepPassword({ password, setPassword, confirm, setConfirm, valid, loading, onContinue }) {
  return (
    <View>
      <Text className="text-3xl font-lm-bold text-text mb-2">Crea tu contraseña</Text>
      <Text className="text-text-muted font-sans mb-8">
        Usa 4 dígitos. La necesitarás para iniciar sesión.
      </Text>

      <Text className="text-text font-lm-medium mb-3">Contraseña</Text>
      <CodeBoxes length={4} value={password} onChange={setPassword} autoFocus />

      <Text className="text-text font-lm-medium mb-3 mt-8">Confirma tu contraseña</Text>
      <CodeBoxes length={4} value={confirm} onChange={setConfirm} />

      {confirm.length === 4 && password !== confirm ? (
        <Text className="text-danger font-sans text-sm mt-3">Las contraseñas no coinciden.</Text>
      ) : null}

      <Pressable
        onPress={onContinue}
        disabled={!valid || loading}
        className={`w-full py-4 rounded-2xl mt-10 bg-primary ${
          valid && !loading ? "active:opacity-80" : "opacity-50"
        }`}
      >
        <Text className="text-center text-text font-lm-bold text-lg">
          {loading ? "Enviando..." : "Continuar"}
        </Text>
      </Pressable>
    </View>
  );
}
