import { View, Text } from "react-native";

function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });
}

export default function HistorialItem({ item }) {
  const esGanado = item.tipo === "ganado";
  const acento = esGanado ? "text-success" : "text-danger";

  return (
    <View className="flex-row items-center px-4 py-4 border-b border-border">
      <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${esGanado ? "bg-primary-light" : "bg-surface"}`}>
        <Text className={`text-lg font-lm-bold ${acento}`}>{esGanado ? "+" : "−"}</Text>
      </View>

      <View className="flex-1">
        <Text className="text-sm text-text font-lm-medium" numberOfLines={2}>
          {item.descripcion}
        </Text>
        <Text className="text-xs text-text-muted mt-1">{formatDate(item.created_at)}</Text>
      </View>

      <Text className={`text-sm font-lm-bold ml-3 ${acento}`}>
        {esGanado ? "+" : "−"}
        {Number(item.puntos).toLocaleString("es-PE", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} pts
      </Text>
    </View>
  );
}
