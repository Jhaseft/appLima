import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { FOOTER_CLEARANCE } from "../FooterLayout/FooterBar";
import { useOperacionStep } from "./hooks/useOperacionStep";
import { useTasaActual, calcularConversion } from "./hooks/useTasaActual";
import ResumenOperacion from "./ResumenOperacion";
import SeccionBanco from "./SeccionBanco";
import SeccionNoBanco from "./SeccionNoBanco";
import ModalCuentaBancaria from "../Modales/ModalCuentaBancaria";
import ModalCuentaDestino from "../Modales/ModalCuentaDestino";
import ModalCuentaQR from "../Modales/ModalCuentaQR";

function mensajeVacio(modo, tipo) {
  if (modo === "PENtoBOB") {
    return tipo === "origen"
      ? "No tienes cuentas bancarias peruanas registradas."
      : "No tienes cuentas bancarias bolivianas registradas.";
  }
  return tipo === "origen"
    ? "No tienes cuentas bancarias bolivianas registradas."
    : "No tienes cuentas bancarias peruanas registradas.";
}

function Checkbox({ checked, onPress, children }) {
  return (
    <TouchableOpacity onPress={onPress} className="flex-row items-start gap-2">
      <View className={`w-5 h-5 rounded border-2 ${checked ? "bg-primary border-primary" : "border-border"}`} />
      <Text className="flex-1 text-xs text-text-muted">{children}</Text>
    </TouchableOpacity>
  );
}

export default function OperacionStep({ onNext, onBack, operacion, setOperacion }) {
  const o = useOperacionStep({ operacion, setOperacion, onNext });
  const { compra, venta } = useTasaActual();
  const tasaVigente = o.isOriginBank ? compra : venta;
  const conversionVigente = calcularConversion(operacion.monto, o.modo, { compra, venta });

  return (
    <ScrollView
      className="flex-1 bg-background px-4 py-4"
      contentContainerStyle={{ paddingBottom: FOOTER_CLEARANCE }}
    >
      <Text className="text-xl font-lm-bold text-text text-center mb-4">Registro de Operación</Text>

      <ResumenOperacion
        operacion={operacion}
        isOriginBank={o.isOriginBank}
        tasa={tasaVigente}
        conversion={conversionVigente}
      />

      {o.isOriginBank ? (
        <SeccionBanco
          label="Cuenta Origen"
          value={o.cuentaOrigen}
          onChange={o.setCuentaOrigen}
          options={o.cuentasOrigen}
          loading={o.loadingCuentas}
          mensajeVacio={mensajeVacio(o.modo, "origen")}
          onAgregar={() => o.setModalAbierto("origen")}
        />
      ) : (
        <SeccionNoBanco
          label="¿Cómo pagará sus bolivianos?"
          modo={o.modo}
          nonBankMethod={o.nonBankMethod}
          setNonBankMethod={o.setNonBankMethod}
          qrUserAccount={o.qrUserAccount}
          loadingQrUser={o.loadingQrUser}
          onAgregarQR={() => o.setModalAbierto("qr")}
        />
      )}

      {o.modo === "BOBtoPEN" && o.nonBankMethod === "qr" && (
        <SeccionBanco
          label="Cuenta desde la que pagarás (Bolivia)"
          value={o.cuentaOrigen}
          onChange={o.setCuentaOrigen}
          options={o.cuentasOrigen}
          loading={o.loadingCuentas}
          mensajeVacio={mensajeVacio(o.modo, "origen")}
          onAgregar={() => o.setModalAbierto("origen")}
        />
      )}

      {o.isDestinationBank ? (
        <SeccionBanco
          label="Cuenta Destino"
          value={o.cuentaDestino}
          onChange={o.setCuentaDestino}
          options={o.cuentasDestino}
          loading={o.loadingCuentas}
          mensajeVacio={mensajeVacio(o.modo, "destino")}
          onAgregar={() => o.setModalAbierto("destino")}
        />
      ) : (
        <SeccionNoBanco
          label="¿Cómo quiere recibir sus bolivianos?"
          modo={o.modo}
          nonBankMethod={o.nonBankMethod}
          setNonBankMethod={o.setNonBankMethod}
          qrUserAccount={o.qrUserAccount}
          loadingQrUser={o.loadingQrUser}
          onAgregarQR={() => o.setModalAbierto("qr")}
        />
      )}

      <View className="gap-2 mb-4">
        <Checkbox checked={o.juramento} onPress={() => o.setJuramento(!o.juramento)}>
          Declaro bajo juramento que la información registrada es veraz y exacta.
        </Checkbox>
        <Checkbox checked={o.terminos} onPress={() => o.setTerminos(!o.terminos)}>
          Acepto los Términos y condiciones y la Política de privacidad.
        </Checkbox>
      </View>

      <View className="flex-row justify-between mt-4 mb-8">
        <TouchableOpacity onPress={onBack} className="bg-border px-6 py-3 rounded-lg">
          <Text className="text-text font-lm-medium">Atrás</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={o.handleSiguiente}
          disabled={!o.puedeSeguir}
          className={`px-6 py-3 rounded-lg ${o.puedeSeguir ? "bg-primary" : "bg-border"}`}
        >
          <Text className="text-text font-lm-bold">Siguiente</Text>
        </TouchableOpacity>
      </View>

      <ModalCuentaBancaria
        isOpen={o.modalAbierto === "origen"}
        onClose={() => o.setModalAbierto(null)}
        user={o.user}
        accountType="origin"
        defaultCountry={o.defaultCountryOrigen}
        onCuentaGuardada={o.onCuentaGuardada}
      />
      <ModalCuentaDestino
        isOpen={o.modalAbierto === "destino"}
        onClose={() => o.setModalAbierto(null)}
        user={o.user}
        defaultCountry={o.defaultCountryDestino}
        onCuentaGuardada={o.onCuentaGuardada}
      />
      <ModalCuentaQR
        isOpen={o.modalAbierto === "qr"}
        onClose={() => o.setModalAbierto(null)}
        user={o.user}
        qrCountry="BO"
        onQRGuardado={o.onQRGuardado}
      />
    </ScrollView>
  );
}
