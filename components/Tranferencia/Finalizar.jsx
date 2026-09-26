import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { X } from "lucide-react-native";
import { colors } from "../../theme/colors";
import { FOOTER_CLEARANCE } from "../FooterLayout/FooterBar";
import { useFinalizar } from "./hooks/useFinalizar";
import ResumenOperacion from "./ResumenOperacion";

export default function Finalizar({ onBack, operacion, setOperacion, verificar, onVolverACotizar }) {
  const f = useFinalizar({ operacion, setOperacion, verificar, onVolverACotizar });
  const lleno = f.comprobantes.length >= f.maxComprobantes;
  const enviarDeshabilitado = !f.comprobanteOpcional && f.comprobantes.length === 0;

  return (
    <ScrollView
      className="flex-1 bg-background px-6 py-4"
      contentContainerStyle={{ paddingBottom: FOOTER_CLEARANCE }}
    >
      <Text className="text-xl font-lm-bold text-text text-center mb-6">Adjunta y Finaliza Operación</Text>

      <ResumenOperacion
        operacion={operacion}
        isOriginBank={f.isOriginBank}
        tasa={f.tasaVigente}
        conversion={f.conversionVigente}
      />

      {f.comprobanteOpcional ? (
        <View className="border border-primary-accent rounded-lg bg-primary-light p-4 mb-4">
          <Text className="text-primary-dark text-sm">
            Pagarás en efectivo en oficina. No necesitas subir comprobante; el administrador adjuntará el comprobante al confirmar la operación.
          </Text>
        </View>
      ) : (
        <>
          <TouchableOpacity
            onPress={f.handlePick}
            disabled={lleno}
            className={`py-3 rounded-lg ${lleno ? "bg-border" : "bg-primary"}`}
          >
            <Text className="text-text font-lm-bold text-center">
              {f.comprobantes.length
                ? `Agregar otro comprobante (${f.comprobantes.length}/${f.maxComprobantes})`
                : "Subir comprobante"}
            </Text>
          </TouchableOpacity>

          <Text className="text-text-muted text-xs mt-2 text-center">
            Solo se aceptan imágenes (JPG, PNG). No se permiten archivos PDF.
          </Text>

          {f.comprobantes.length > 0 && (
            <View className="mt-4 flex-row flex-wrap justify-center gap-3">
              {f.comprobantes.map((c, idx) => (
                <View key={idx} className="relative">
                  <Image source={{ uri: c.uri }} className="w-28 h-28 rounded-lg" />
                  <TouchableOpacity
                    onPress={() => f.handleRemove(idx)}
                    className="absolute -top-2 -right-2 bg-danger rounded-full w-6 h-6 items-center justify-center"
                  >
                    <X size={14} color={colors.background} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </>
      )}

      {f.error ? <Text className="text-danger text-sm mt-2 text-center">{f.error}</Text> : null}

      <View className="flex-row justify-between mt-10 mb-8">
        <TouchableOpacity onPress={onBack} className="bg-border px-6 py-3 rounded-lg">
          <Text className="text-text font-lm-medium">Atrás</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={enviarDeshabilitado}
          onPress={f.handleEnviar}
          className={`px-6 py-3 rounded-lg ${enviarDeshabilitado ? "bg-border" : "bg-text"}`}
        >
          <Text className="text-background font-lm-bold">
            {f.comprobanteOpcional ? "Confirmar operación" : "Finalizar"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
