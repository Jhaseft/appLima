import { View, Text, TextInput, TouchableOpacity, Linking } from "react-native";
import BankSelect from "./BankSelect";
import ToggleSwitch from "./ToggleSwitch";
import BottomSheet from "../BottomSheet";
import ActionOverlay from "../ActionOverlay";
import { useFormBancaria } from "./hooks/useFormBancaria";
import { colors } from "../../theme/colors";
import API_BASE_URL from "../api";

export default function ModalCuentaBancaria({
  bancos: bancosProp,
  isOpen,
  onClose,
  user,
  accountType = "origin",
  defaultCountry = null,
  onCuentaGuardada,
}) {
  const f = useFormBancaria({ isOpen, bancosProp, user, accountType, onCuentaGuardada, onClose });

  return (
    <BottomSheet
      visible={isOpen}
      onClose={onClose}
      overlay={<ActionOverlay visible={f.loading} mensaje="Guardando cuenta..." />}
      contentContainerStyle={{ alignItems: "center", paddingHorizontal: 24, paddingBottom: 36 }}
    >
      <Text className="text-xl font-lm-bold text-text mb-1">Registrar cuenta</Text>
      <Text className="text-sm font-sans text-text-muted mb-6">Cuenta de origen</Text>

      <Text className="text-xs font-lm-medium text-text-muted uppercase mb-2 w-full">
        ¿Desde que cuenta enviaras el dinero ?
      </Text>

      <View className="w-full">
        <BankSelect
          options={f.bancos}
          value={f.banco}
          onChange={f.setBanco}
          loading={f.bancos.length === 0}
          defaultCountry={defaultCountry}
        />
      </View>

      <TextInput
        className="border border-border rounded-xl p-4 mt-3 mb-5 text-base font-sans bg-surface w-full text-text"
        placeholder={f.cuentaPlaceholder}
        placeholderTextColor={colors.textMuted}
        keyboardType={f.cuentaType}
        value={f.numeroCuenta}
        onChangeText={f.setNumeroCuenta}
      />

      <View className="mb-7 w-full gap-4">
        <ToggleSwitch value={f.juramento} onToggle={() => f.setJuramento((v) => !v)}>
          Declaro bajo juramento que soy el titular de la cuenta bancaria registrada.
        </ToggleSwitch>

        <ToggleSwitch value={f.terminos} onToggle={() => f.setTerminos((v) => !v)}>
          Acepto los{" "}
          <Text className="text-primary-dark font-lm-medium underline" onPress={() => Linking.openURL(`${API_BASE_URL}/politicas`)}>
            Términos y Política de privacidad
          </Text>
        </ToggleSwitch>
      </View>

      <View className="flex-row gap-3 w-full">
        <TouchableOpacity className="flex-1 border border-border py-3.5 rounded-2xl" onPress={onClose}>
          <Text className="text-text font-lm-medium text-base text-center">Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 py-3.5 rounded-2xl bg-primary"
          style={{ opacity: f.canSave ? 1 : 0.5 }}
          onPress={f.submit}
          disabled={!f.canSave}
        >
          <Text className="text-text font-lm-bold text-base text-center">Guardar</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}
