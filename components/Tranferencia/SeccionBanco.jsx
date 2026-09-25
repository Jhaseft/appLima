import { View, Text, TouchableOpacity } from "react-native";
import { CreditCard } from "lucide-react-native";
import { colors } from "../../theme/colors";
import CuentaSelect from "../Cuentas/CuentasSelectTransfenrecias";
import SinCuentas from "../Cuentas/SinCuentas";

export default function SeccionBanco({ label, value, onChange, options, loading, mensajeVacio, onAgregar }) {
  return (
    <View className="mb-4">
      <Text className="text-text font-lm-medium mb-2">{label}</Text>

      {loading ? (
        <View className="border border-border rounded-lg h-12 bg-surface" />
      ) : options.length === 0 ? (
        <View>
          <SinCuentas mensaje={mensajeVacio} />
          <TouchableOpacity
            onPress={onAgregar}
            className="flex-row items-center justify-center gap-2 bg-primary py-3 rounded-lg mt-2"
          >
            <CreditCard size={16} color={colors.text} />
            <Text className="text-text font-lm-medium">Agregar cuenta</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <CuentaSelect
          options={options.map((c) => ({
            id: c.id,
            bank_name: c.bank?.name || "Banco",
            account_number: c.account_number,
            bank_logo: c.bank?.logo,
            ...c,
          }))}
          value={value}
          onChange={onChange}
          placeholder="Selecciona una cuenta"
        />
      )}
    </View>
  );
}
