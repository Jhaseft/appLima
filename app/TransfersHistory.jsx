import { View, Text, FlatList, RefreshControl } from "react-native";
import HeaderUser from "../components/UserDropdown/HeaderUser";
import { useTransfers } from "../components/TranfersHistory/useTransfers";
import TransferCard from "../components/TranfersHistory/TransferCard";
import SearchBar from "../components/TranfersHistory/SearchBar";
import TransfersHistorialSkeleton from "../components/TranfersHistory/TransfersHistorialSkeleton";
import Bone from "../components/Home/Bone";
import { colors } from "../theme/colors";

export default function TransfersHistory() {
  const { transfers, loading, loadingMore, refreshing, refrescar, search, onSearch, triggerSearch, loadMore } = useTransfers();

  return (
    <View className="flex-1 bg-surface">
      <HeaderUser title="Historial de Operaciones" subtitle="Todas tus transferencias" />

      {loading || refreshing ? (
        <View className="flex-1 px-4 pt-6">
          <SearchBar search={search} onSearch={onSearch} triggerSearch={triggerSearch} />
          <TransfersHistorialSkeleton />
        </View>
      ) : (
        <FlatList
          data={transfers}
          keyExtractor={(t) => String(t.id)}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 24 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refrescar}
              colors={[colors.primary]}
              tintColor={colors.primary}
              progressBackgroundColor={colors.background}
            />
          }
          ListHeaderComponent={<SearchBar search={search} onSearch={onSearch} triggerSearch={triggerSearch} />}
          ListEmptyComponent={
            <Text className="text-text-muted text-center">
              {search.trim() ? "No se encontró ninguna transferencia con ese ID" : "No hay transferencias"}
            </Text>
          }
          ListFooterComponent={loadingMore ? <Bone className="h-40 rounded-2xl mt-1" /> : null}
          renderItem={({ item }) => <TransferCard transfer={item} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
        />
      )}
    </View>
  );
}
