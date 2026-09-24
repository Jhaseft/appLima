import { View, Text, TouchableOpacity } from "react-native";
import { Plus, Trash2 } from "lucide-react-native";
import { colors } from "../../theme/colors";
import CuentaSelect from "./CuentasSelect";
import InfoTooltip from "./InfoTooltip";
import SinCuentas from "./SinCuentas";
import DestinatarioInfo from "./DestinatarioInfo";
import Bone from "../Home/Bone";

const BOTON = { width: 48, height: 48 };

function BotonAccion({ children, className, onPress, disabled, style }) {
  return (
    <TouchableOpacity
      className={`rounded-xl justify-center items-center ${className}`}
      style={[BOTON, style]}
      onPress={onPress}
      disabled={disabled}
    >
      {children}
    </TouchableOpacity>
  );
}

export default function CuentasSection({
  tipo,
  titulo,
  tooltip,
  mensajeVacio,
  cuentas,
  selected,
  onSelect,
  onAdd,
  onDelete,
  loading,
}) {
  const esDestino = tipo === "destination";

  return (
    <View className="mb-6">
      <View className="flex-row items-center mb-3">
        <Text className="font-lm-bold text-lg text-text">{titulo}</Text>
        <InfoTooltip texto={tooltip} />
      </View>

      {loading ? (
        <Bone className="rounded-xl h-14" />
      ) : cuentas.length === 0 ? (
        <View className="flex-row items-center gap-3">
          <View className="flex-1">
            <SinCuentas mensaje={mensajeVacio} />
          </View>
          <BotonAccion className="bg-primary" onPress={onAdd}>
            <Plus size={24} color={colors.text} />
          </BotonAccion>
        </View>
      ) : (
        <View>
          <View className="flex-row items-center gap-3">
            <CuentaSelect
              options={cuentas.map((c) => ({
                ...c,
                logo_url: c.bank?.logo_url,
                name: c.bank?.name || c.account_number,
              }))}
              value={selected}
              onChange={onSelect}
              placeholder="Selecciona cuenta"
            />
            <BotonAccion className="bg-primary" onPress={onAdd}>
              <Plus size={24} color={colors.text} />
            </BotonAccion>
            <BotonAccion
              className="bg-danger"
              onPress={() => onDelete(selected)}
              disabled={!selected}
              style={{ opacity: !selected ? 0.4 : 1 }}
            >
              <Trash2 size={22} color={colors.background} />
            </BotonAccion>
          </View>

          {esDestino && selected && <DestinatarioInfo cuenta={selected} />}
        </View>
      )}
    </View>
  );
}
