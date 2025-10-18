import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../ContextUser/UserContext";
import FooterLayout from "../FooterLayout/FooterLayout";
import HeaderUser from "../UserDropdown/HeaderUser";

export default function SelectTransfers() {
  const { user } = useUser();
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "orange";
      case "verified": return "blue";
      case "completed": return "green";
      case "rejected": return "red";
      default: return "gray";
    }
  };

  const renderOwnerInfo = (owner) => {
    if (!owner) return <Text>-</Text>;
    return (
      <View className="mt-1 space-y-0.5">
        <Text className="text-gray-700">Nombre: {owner.full_name}</Text>
        <Text className="text-gray-700">Doc: {owner.document_number}</Text>
        <Text className="text-gray-700">Tel: {owner.phone}</Text>
      </View>
    );
  };

  useEffect(() => {
    if (!user?.id) return;

    const fetchTransfers = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");

        // Revisar si hay cache
        const cache = await AsyncStorage.getItem("transfers");
        const lastFetch = await AsyncStorage.getItem("transfers_lastFetch");
        const now = Date.now();

        if (cache && lastFetch && now - parseInt(lastFetch) < 5 * 60 * 1000) {
          setTransfers(JSON.parse(cache));
          setLoading(false);
        }

        // Hacer fetch de la API
        const res = await fetch(
          `https://panel.transfercash.click/api/transfers/historymobile?user_id=${user?.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Error cargando transferencias");
        const data = await res.json();

        setTransfers(data);

        // Guardar en AsyncStorage
        await AsyncStorage.setItem("transfers", JSON.stringify(data));
        await AsyncStorage.setItem("transfers_lastFetch", now.toString());
      } catch (err) {
        console.error("Error cargando transfers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransfers();
  }, [user]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="black" />
        <Text className="mt-2 text-gray-700 text-base">Cargando historial...</Text>
      </View>
    );
  }

  return (
    <FooterLayout>
      <HeaderUser title="Historial de Operaciones" />
      <ScrollView className="flex-1 bg-gray-50 px-4 py-6">
        {transfers.length === 0 ? (
          <Text className="text-gray-500 text-center">No hay transferencias</Text>
        ) : (
          transfers.map((t) => (
            <View 
              key={t.id} 
              className="bg-white p-5 rounded-2xl shadow-lg border border-gray-200 mb-5"
            >
              {/* Fecha y Estado */}
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-gray-600 text-sm">{t.fecha}</Text>
                <Text className="px-3 py-1 rounded-full font-semibold text-sm" style={{ color: getStatusColor(t.estado) }}>
                  {t.estado}
                </Text>
              </View>

              {/* Montos y modo */}
              <View className="bg-gray-50 p-3 rounded-lg mb-3 space-y-1">
                <Text className="text-gray-700">Monto: {t.monto} Bs</Text>
                <Text className="text-gray-700">Monto Conv: {t.converted_amount} Bs</Text>
                <Text className="text-gray-700">Modo: {t.modo}</Text>
              </View>

              {/* Origen y Destino */}
              <View className="bg-gray-50 p-3 rounded-lg mb-3 space-y-1">
                <Text className="text-gray-700">Origen: {t.origen?.numero} - {t.origen?.banco}</Text>
                <Text className="text-gray-700">Destino: {t.destino?.numero} - {t.destino?.banco}</Text>
              </View>

              {/* Propietarios */}
              <View className="bg-gray-50 p-3 rounded-lg space-y-2">
                <Text className="text-gray-800 font-semibold mt-2">Propietario Destino:</Text>
                {renderOwnerInfo(t.destino?.owner)}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </FooterLayout>
  );
}
