import { View, Text, Modal, Pressable, ScrollView, ActivityIndicator } from "react-native";

function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });
}

function HistorialItem({ item }) {
  const esGanado = item.tipo === "ganado";
  return (
    <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
      <View
        className={`w-9 h-9 rounded-full items-center justify-center mr-3 ${
          esGanado ? "bg-green-100" : "bg-red-100"
        }`}
      >
        <Text className={`text-base font-bold ${esGanado ? "text-green-600" : "text-red-500"}`}>
          {esGanado ? "+" : "−"}
        </Text>
      </View>

      <View className="flex-1">
        <Text className="text-sm text-gray-800 font-medium" numberOfLines={2}>
          {item.descripcion}
        </Text>
        <Text className="text-xs text-gray-400 mt-0.5">{formatDate(item.created_at)}</Text>
      </View>

      <Text className={`text-sm font-bold ml-2 ${esGanado ? "text-green-600" : "text-red-500"}`}>
        {esGanado ? "+" : "−"}
        {Number(item.puntos).toLocaleString("es-PE", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} pts
      </Text>
    </View>
  );
}

export default function HistorialPuntos({ visible, onClose, historial, loading }) {
  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl overflow-hidden" style={{ maxHeight: "80%" }}>
          <View className="flex-row items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
            <Text className="text-lg font-bold text-gray-900">Historial de puntos</Text>
            <Pressable onPress={onClose} className="p-1">
              <Text className="text-gray-400 text-2xl leading-none">×</Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {loading ? (
              <View className="py-12 items-center">
                <ActivityIndicator size="small" color="#fdc834" />
              </View>
            ) : historial.length === 0 ? (
              <View className="py-12 items-center">
                <Text className="text-sm text-gray-400">Aún no tienes movimientos</Text>
              </View>
            ) : (
              historial.map((item) => <HistorialItem key={item.id} item={item} />)
            )}
            <View className="h-8" />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
