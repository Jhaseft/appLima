import { View, Text, ScrollView, RefreshControl } from "react-native";
import { colors } from "../../theme/colors";
import { FOOTER_CLEARANCE } from "../../components/FooterLayout/FooterBar";
import HeaderUser from "../../components/UserDropdown/HeaderUser";
import { useCuentasScreen } from "../../components/Cuentas/hooks/useCuentasScreen";
import VistaToggle from "../../components/Cuentas/VistaToggle";
import CuentasSection from "../../components/Cuentas/CuentasSection";
import TarjetaQR from "../../components/Cuentas/TarjetaQR";
import CuentasSkeleton from "../../components/Cuentas/CuentasSkeleton";
import ModalCuentaBancaria from "../../components/Modales/ModalCuentaBancaria";
import ModalCuentaDestino from "../../components/Modales/ModalCuentaDestino";
import ModalCuentaQR from "../../components/Modales/ModalCuentaQR";

const TOOLTIP_ORIGEN =
  "Esta es tu cuenta bancaria en Perú (o Bolivia). Desde aquí nos envías el dinero que quieres transferir.";
const TOOLTIP_DESTINO =
  "Esta es la cuenta del destinatario en Perú (o Bolivia). A esta cuenta le haremos llegar el dinero.";
const VACIO_ORIGEN =
  "Aún no tienes cuentas de origen. Agrega una cuenta de un banco (peruano o boliviano) desde la que nos enviarás el dinero.";
const VACIO_DESTINO =
  "Aún no tienes cuentas de destino. Agrega la cuenta del banco (peruano o boliviano) al que quieres enviar el dinero.";

export default function CuentasScreen() {
  const c = useCuentasScreen();

  return (
    <View className="flex-1 bg-background">
      <HeaderUser title="Mis Cuentas" subtitle="Gestiona tus cuentas y QR" />

      {c.loadingUser ? (
        <CuentasSkeleton />
      ) : (
        <ScrollView
          className="flex-1 bg-background"
          contentContainerStyle={{ padding: 16, paddingBottom: FOOTER_CLEARANCE }}
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
          <VistaToggle value={c.tipoVista} onChange={c.setTipoVista} />

          {c.tipoVista === "bank" ? (
            <>
              <CuentasSection
                tipo="origin"
                titulo="Cuentas de Origen"
                tooltip={TOOLTIP_ORIGEN}
                mensajeVacio={VACIO_ORIGEN}
                cuentas={c.cuentasOrigen}
                selected={c.cuentaOrigen}
                onSelect={c.setCuentaOrigen}
                onAdd={() => c.abrirAgregar("origin")}
                onDelete={(cuenta) => c.eliminar(cuenta, "origin")}
                loading={c.bancarias.loading}
              />
              <CuentasSection
                tipo="destination"
                titulo="Cuentas de Destino"
                tooltip={TOOLTIP_DESTINO}
                mensajeVacio={VACIO_DESTINO}
                cuentas={c.cuentasDestino}
                selected={c.cuentaDestino}
                onSelect={c.setCuentaDestino}
                onAdd={() => c.abrirAgregar("destination")}
                onDelete={(cuenta) => c.eliminar(cuenta, "destination")}
                loading={c.bancarias.loading}
              />
            </>
          ) : (
            <>
              <Text className="text-sm text-text-muted mb-4 text-center">
                Registra tu código QR para cada país. Lo usaremos para enviarte el dinero.
              </Text>
              <TarjetaQR country="PE" cuenta={c.qr.qr.PE} loading={c.qr.loading} onAdd={() => c.abrirQR("PE")} />
              <TarjetaQR country="BO" cuenta={c.qr.qr.BO} loading={c.qr.loading} onAdd={() => c.abrirQR("BO")} />
            </>
          )}
        </ScrollView>
      )}

      {c.tipoAgregar === "origin" ? (
        <ModalCuentaBancaria
          isOpen={c.openBanco}
          onClose={() => c.setOpenBanco(false)}
          accountType="origin"
          user={c.user}
          bancos={[]}
          onCuentaGuardada={c.guardarOrigen}
        />
      ) : (
        <ModalCuentaDestino
          isOpen={c.openBanco}
          onClose={() => c.setOpenBanco(false)}
          user={c.user}
          bancos={[]}
          onCuentaGuardada={c.guardarDestino}
        />
      )}

      <ModalCuentaQR
        isOpen={c.openQR}
        onClose={() => c.setOpenQR(false)}
        user={c.user}
        qrCountry={c.qrCountry}
        onQRGuardado={(guardada) => c.qr.fijarQR(guardada)}
      />
    </View>
  );
}
