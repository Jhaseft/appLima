import { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FooterLayout from "../FooterLayout/FooterLayout";
import HeaderUser from "../UserDropdown/HeaderUser";
import API_BASE_URL from "../api";

async function authHeaders() {
  const token = await AsyncStorage.getItem("token");
  return { Authorization: `Bearer ${token}`, Accept: "application/json" };
}

function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });
}

function HistorialItem({ item }) {
  const esGanado = item.tipo === "ganado";
  return (
    <View className="flex-row items-center px-4 py-4 border-b border-gray-100">
      <View
        className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
          esGanado ? "bg-green-100" : "bg-red-100"
        }`}
      >
        <Text className={`text-lg font-bold ${esGanado ? "text-green-600" : "text-red-500"}`}>
          {esGanado ? "+" : "−"}
        </Text>
      </View>

      <View className="flex-1">
        <Text className="text-sm text-gray-800 font-medium" numberOfLines={2}>
          {item.descripcion}
        </Text>
        <Text className="text-xs text-gray-400 mt-1">{formatDate(item.created_at)}</Text>
      </View>

      <Text className={`text-sm font-bold ml-3 ${esGanado ? "text-green-600" : "text-red-500"}`}>
        {esGanado ? "+" : "−"}
        {Number(item.puntos).toLocaleString("es-PE", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} pts
      </Text>
    </View>
  );
}

export default function HistorialScreen() {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistorial = useCallback(async () => {
    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_BASE_URL}/api/tc-puntos/historial`, { headers });
      if (res.ok) {
        const d = await res.json();
        setHistorial(d.data ?? []);
      }
    } catch (_) {}
    finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchHistorial(); }, []);

  const onRefresh = () => { setRefreshing(true); fetchHistorial(); };

  return (
    <FooterLayout>
      <HeaderUser title="Historial de puntos" subtitle="Tus movimientos de TC Puntos" />

      {loading ? (
        <View className="flex-1 items-center justify-center bg-white">
          <ActivityIndicator size="large" color="#fdc834" />
        </View>
      ) : (
        <ScrollView
          className="flex-1 bg-white"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#fdc834"]} tintColor="#fdc834" />
          }
        >
          {historial.length === 0 ? (
            <View className="flex-1 items-center justify-center py-24">
              <Text className="text-4xl mb-4">📋</Text>
              <Text className="text-base font-bold text-gray-700 mb-1">Sin movimientos</Text>
              <Text className="text-sm text-gray-400 text-center px-10">
                Aquí verás tus puntos ganados y canjeados.
              </Text>
            </View>
          ) : (
            <View className="bg-white">
              {historial.map((item) => (
                <HistorialItem key={item.id} item={item} />
              ))}
            </View>
          )}
          <View className="h-8" />
        </ScrollView>
      )}
    </FooterLayout>
  );
}
