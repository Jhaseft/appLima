import { View, Text, ActivityIndicator, FlatList, TextInput, TouchableOpacity } from "react-native";
import HeaderUser from "../UserDropdown/HeaderUser";
import { useTransfers } from "./useTransfers";
import TransferCard from "./TransferCard";
import { Search } from "lucide-react-native";

export default function SelectTransfers() {
  const { transfers, loading, loadingMore, hasMore, search, onSearch, triggerSearch, loadMore } =
    useTransfers();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="black" />
        <Text className="mt-2 text-gray-700 text-base">Cargando historial...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <HeaderUser title="Historial de Operaciones" subtitle="Todas tus transferencias" />

      <FlatList
        data={transfers}
        keyExtractor={(t) => String(t.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 24 }}
        ListHeaderComponent={
          <View className="bg-white flex-row items-center p-3 rounded-2xl shadow-lg border border-gray-200 mb-5 gap-2">
            <Search size={20} color="#6b7280" />
            <TextInput
              className="flex-1 text-gray-800 text-sm"
              placeholder="Buscar por ID de transferencia..."
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              returnKeyType="search"
              value={search}
              onChangeText={onSearch}
              onSubmitEditing={triggerSearch}
            />
            <TouchableOpacity
              onPress={triggerSearch}
              className="bg-black px-3 py-1.5 rounded-xl"
            >
              <Text className="text-white text-sm font-semibold">Buscar</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          <Text className="text-gray-500 text-center">
            {search.trim()
              ? "No se encontró ninguna transferencia con ese ID"
              : "No hay transferencias"}
          </Text>
        }
        ListFooterComponent={
          loadingMore ? (
            <View className="py-4 items-center">
              <ActivityIndicator size="small" color="black" />
            </View>
          ) : null
        }
        renderItem={({ item }) => <TransferCard transfer={item} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
      />
    </View>
  );
}
