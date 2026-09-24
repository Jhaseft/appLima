import { View, Text, ScrollView, RefreshControl, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { colors } from "../theme/colors";
import HeaderUser from "../components/UserDropdown/HeaderUser";
import { useHistorial } from "../components/TcPuntos/hooks/useHistorial";
import HistorialItem from "../components/TcPuntos/HistorialItem";
import HistorialSkeleton from "../components/TcPuntos/HistorialSkeleton";

export default function TcPuntosHistorialPage() {
  const router = useRouter();
  const h = useHistorial();

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center px-4 pt-2">
        <Pressable onPress={() => router.back()} hitSlop={8} className="p-1">
          <ArrowLeft size={24} color={colors.text} />
        </Pressable>
      </View>

      <HeaderUser title="Historial de puntos" subtitle="Tus movimientos de TC Puntos" />

      {h.loading || h.refreshing ? (
        <HistorialSkeleton />
      ) : (
        <ScrollView
          className="flex-1 bg-background"
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={h.refreshing}
              onRefresh={h.refrescar}
              colors={[colors.primary]}
              tintColor={colors.primary}
              progressBackgroundColor={colors.background}
            />
          }
        >
          {h.historial.length === 0 ? (
            <View className="flex-1 items-center justify-center py-24">
              <Text className="text-base font-lm-bold text-text mb-1">Sin movimientos</Text>
              <Text className="text-sm text-text-muted text-center px-10">
                Aquí verás tus puntos ganados y canjeados.
              </Text>
            </View>
          ) : (
            <View className="bg-background">
              {h.historial.map((item) => (
                <HistorialItem key={item.id} item={item} />
              ))}
            </View>
          )}
          <View className="h-8" />
        </ScrollView>
      )}
    </View>
  );
}
