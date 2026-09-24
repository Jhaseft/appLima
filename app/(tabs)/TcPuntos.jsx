import { View, Text, ScrollView, RefreshControl } from "react-native";
import { colors } from "../../theme/colors";
import { FOOTER_CLEARANCE } from "../../components/FooterLayout/FooterBar";
import HeaderUser from "../../components/UserDropdown/HeaderUser";
import { useTcPuntosScreen } from "../../components/TcPuntos/hooks/useTcPuntosScreen";
import TcPuntoIcon from "../../components/TcPuntos/TcPuntoIcon";
import BalanceCard from "../../components/TcPuntos/BalanceCard";
import CategoriaSection from "../../components/TcPuntos/CategoriaSection";
import CanjeModal from "../../components/TcPuntos/CanjeModal";
import ComoFuncionaModal from "../../components/TcPuntos/ComoFuncionaModal";
import TcPuntosSkeleton from "../../components/TcPuntos/TcPuntosSkeleton";

export default function TcPuntosScreen() {
  const t = useTcPuntosScreen();

  return (
    <View className="flex-1 bg-background">
      <HeaderUser title="TC Puntos" subtitle="Programa de recompensas" />

      {t.loading || t.refreshing ? (
        <TcPuntosSkeleton />
      ) : (
        <ScrollView
          className="flex-1 bg-surface"
          contentContainerStyle={{ paddingBottom: FOOTER_CLEARANCE }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={t.refreshing}
              onRefresh={t.onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
              progressBackgroundColor={colors.background}
            />
          }
        >
          <BalanceCard
            balance={t.balance}
            valorPunto={t.valorPunto}
            moneda={t.moneda}
            onInfoPress={() => t.setInfoVisible(true)}
          />

          <View className="pt-4 pb-8">
            {!t.hayProductos ? (
              <View className="items-center px-8 py-12">
                <TcPuntoIcon size={56} />
                <Text className="text-xl font-lm-bold text-text mt-5 mb-2 text-center">Próximamente</Text>
                <Text className="text-text-muted text-sm text-center leading-6">
                  Aquí encontrarás productos y promociones exclusivas que podrás canjear con tus TC Puntos.
                </Text>
              </View>
            ) : (
              t.categorias.map((cat) => (
                <CategoriaSection key={cat.id} categoria={cat} balance={t.balance} onCanjear={t.abrirCanje} />
              ))
            )}
          </View>
        </ScrollView>
      )}

      <ComoFuncionaModal
        visible={t.infoVisible}
        onClose={() => t.setInfoVisible(false)}
        moneda={t.moneda}
        umbral={t.umbral}
      />
      <CanjeModal
        producto={t.producto}
        balance={t.balance ?? 0}
        visible={t.canjeVisible}
        onClose={() => t.setCanjeVisible(false)}
        onConfirm={t.confirmarCanje}
        loading={t.canjeando}
      />
    </View>
  );
}
