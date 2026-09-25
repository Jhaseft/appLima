import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  RefreshControl,
  Platform,
} from "react-native";
import { RefreshCw } from "lucide-react-native";
import { colors } from "../../theme/colors";
import { FOOTER_CLEARANCE } from "../FooterLayout/FooterBar";
import { useCotiza } from "./hooks/useCotiza";
import CotizaSkeleton from "./CotizaSkeleton";

export default function Cotiza({ onNext, operacion, setOperacion }) {
  const c = useCotiza({ onNext, operacion, setOperacion });

  if (c.loading || c.refreshing) return <CotizaSkeleton />;

  if (!c.tasa) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-danger font-sans">No se pudo obtener la tasa.</Text>
      </View>
    );
  }

  const montoValido = c.monto && parseFloat(c.monto.replace(",", ".")) > 0;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 50,
          paddingVertical: 30,
          paddingBottom: FOOTER_CLEARANCE + 30,
        }}
        keyboardShouldPersistTaps="handled"
        alwaysBounceVertical
        refreshControl={
          <RefreshControl
            refreshing={c.refreshing}
            onRefresh={c.onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
            progressBackgroundColor={colors.background}
          />
        }
      >
        <Text className="text-2xl font-lm-bold text-text">TransferCash</Text>
        <Text className="text-sm text-text-muted text-center mb-4">
          Cambio de divisas rápido, seguro y confiable
        </Text>

        <View className="flex-row justify-between w-full mb-4">
          <Text className="text-text font-lm-medium">
            COMPRA: <Text className="text-primary-accent">{c.tasaCompra.toFixed(2)}</Text>
          </Text>
          <Text className="text-text font-lm-medium">
            VENTA: <Text className="text-primary-accent">{c.tasaVenta.toFixed(2)}</Text>
          </Text>
        </View>

        <View className="w-full bg-background p-6 gap-3 rounded-xl border border-border">
          <View>
            <Text className="text-sm font-lm-medium text-text-muted text-center mb-1">
              {c.modo === "BOBtoPEN" ? "TIENES BOLIVIANOS" : "TIENES SOLES"}
            </Text>
            <TextInput
              keyboardType="numeric"
              value={c.monto.toString()}
              onChangeText={c.handleCambio}
              placeholder="0.00"
              className="border border-border rounded-lg px-3 py-2 text-center font-lm-medium text-text"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View className="flex-row justify-center">
            <TouchableOpacity onPress={c.toggleModo} className="p-2 bg-primary rounded-full shadow">
              <RefreshCw size={22} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View>
            <Text className="text-sm font-lm-medium text-text-muted text-center mb-1">
              {c.modo === "BOBtoPEN" ? "RECIBES SOLES" : "RECIBES BOLIVIANOS"}
            </Text>
            <TextInput
              value={c.conversion.toString()}
              editable={false}
              className="border border-border rounded-lg px-3 py-2 text-center font-lm-medium bg-surface text-text"
            />
          </View>

          {c.error ? (
            <Text className="text-danger text-sm text-center">{c.error}</Text>
          ) : null}

          <TouchableOpacity
            onPress={c.handleNext}
            className={`py-3 rounded-lg mt-2 shadow ${montoValido ? "bg-primary" : "bg-border"}`}
            disabled={!montoValido}
          >
            <Text className="text-text font-lm-bold text-center">Iniciar Operación</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
