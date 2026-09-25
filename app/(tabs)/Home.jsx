import { View, Text, ScrollView, RefreshControl } from "react-native";
import { FOOTER_CLEARANCE } from "../../components/FooterLayout/FooterBar";
import HeaderUser from "../../components/UserDropdown/HeaderUser";
import Botons from "../../components/Home/Botons";
import GraficoLineas from "../../components/Home/Grafico";
import Horarios from "../../components/Home/Horarios";
import BannerCarousel from "../../components/Home/BannerCarousel";
import StatsCarousel from "../../components/Home/StatsCarousel";
import { useUser } from "../../components/ContextUser/UserContext";
import { useState } from "react";
import { useTipoCambio } from "../../components/Home/hooks/useTipoCambio";
import { useBanners } from "../../components/Home/hooks/useBanners";
import { useResumen } from "../../components/Home/ResumenContext";
import { colors } from "../../theme/colors";
export default function Home() {
  const { user } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const { data, refresh } = useTipoCambio();
  const banners = useBanners();
  const resumen = useResumen();
  return (
    <ScrollView
      className="flex-1 bg-background px-6"
      contentContainerStyle={{ paddingBottom: FOOTER_CLEARANCE }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await refresh();
            await resumen.refrescar();
            await banners.reload();
            setRefreshing(false);
          }}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    >
      <HeaderUser image />
      <BannerCarousel banners={banners.banners} loading={refreshing} />
      <View className="my-7">
        <Text className="text-2xl font-lm-bold text-text">
          Bienvenido(a) {user?.first_name || "Usuario"}
        </Text>
      </View>
      <StatsCarousel resumen={resumen.resumen} loading={refreshing} />
      <Botons />
      <GraficoLineas data={data} loading={refreshing} />
      <Horarios />
    </ScrollView>
  );
}
