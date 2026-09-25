import { View, Text, TextInput, TouchableOpacity, Linking } from "react-native";
import BankSelect from "./BankSelect";
import ToggleSwitch from "./ToggleSwitch";
import BottomSheet from "../BottomSheet";
import ActionOverlay from "../ActionOverlay";
import { useFormDestino } from "./hooks/useFormDestino";
import { colors } from "../../theme/colors";
import API_BASE_URL from "../api";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const INPUT = "border border-border rounded-xl p-4 text-base font-sans bg-surface w-full text-text";

export default function ModalCuentaDestino({ bancos: bancosProp, isOpen, onClose, user, defaultCountry = null, onCuentaGuardada }) {
  const f = useFormDestino({ isOpen, bancosProp, user, onCuentaGuardada, onClose });
  const insets = useSafeAreaInsets();
  return (
    <BottomSheet
      visible={isOpen} 
      onClose={onClose}
      overlay={<ActionOverlay visible={f.loading} mensaje="Guardando cuenta..." />}
      contentContainerStyle={{ alignItems: "center", paddingHorizontal: 24, paddingBottom: insets.bottom+10 }}
    >
      <Text className="text-xl font-lm-bold text-text mb-1">Registrar cuenta destino</Text>
      <Text className="text-sm font-sans text-text-muted mb-6">Cuenta de un tercero</Text>

      <Text className="text-xs font-lm-medium text-text-muted uppercase mb-2 w-full">
        ¿A que cuenta enviaremos el dinero ?
      </Text>

      <View className="w-full">
        <BankSelect options={f.bancos} value={f.banco} onChange={f.setBanco} loading={f.bancos.length === 0} defaultCountry={defaultCountry} />
      </View>

      <View className="w-full mt-4 mb-1 bg-surface border border-border rounded-2xl p-4 gap-3">
        <Text className="text-xs font-lm-medium text-text-muted uppercase">Datos del propietario</Text>
        <TextInput className={INPUT} placeholder="Nombre completo" placeholderTextColor={colors.textMuted} value={f.nombre} onChangeText={f.setNombre} autoCapitalize="words" maxLength={60} />
        <TextInput className={INPUT} placeholder="CI o DNI" placeholderTextColor={colors.textMuted} value={f.documento} onChangeText={f.setDocumento} keyboardType="number-pad" maxLength={15} />
        <TextInput className={INPUT} placeholder="Número de contacto" placeholderTextColor={colors.textMuted} value={f.contacto} onChangeText={f.setContacto} keyboardType="phone-pad" maxLength={15} />
      </View>

      <TextInput
        className={`${INPUT} my-4`}
        placeholder={f.cuentaPlaceholder}
        placeholderTextColor={colors.textMuted}
        keyboardType={f.cuentaType}
        maxLength={20}
        value={f.numeroCuenta}
        onChangeText={f.setNumeroCuenta}
      />

      <View className="mb-7 w-full gap-4">
        <ToggleSwitch value={f.juramento} onToggle={() => f.setJuramento((v) => !v)}>
          Declaro bajo juramento que soy responsable de la cuenta registrada.
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
