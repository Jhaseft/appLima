import { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, ActivityIndicator, RefreshControl, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FooterLayout from "../FooterLayout/FooterLayout";
import HeaderUser from "../UserDropdown/HeaderUser";
import TcPuntoIcon from "./TcPuntoIcon";
import BalanceCard from "./BalanceCard";
import CategoriaSection from "./CategoriaSection";
import CanjeModal from "./CanjeModal";
import ComoFuncionaModal from "./ComoFuncionaModal";
import { useTcPuntos } from "./TcPuntosContext";
import API_BASE_URL from "../api";

async function authHeaders() {
  const token = await AsyncStorage.getItem("token");
  return { Authorization: `Bearer ${token}`, Accept: "application/json" };
}

export default function TcPuntos() {
  const { balance, valorPunto, refrescar, fijarBalance } = useTcPuntos();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [canjeVisible, setCanjeVisible] = useState(false);
  const [canjeLoading, setCanjeLoading] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);

  const fetchCatalogo = useCallback(async () => {
    try {
      const headers = await authHeaders();
      const catalogoRes = await fetch(`${API_BASE_URL}/api/tc-puntos/catalogo`, { headers });
      if (catalogoRes.ok) setCategorias(await catalogoRes.json());
    } catch (_) {}
    finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchCatalogo(); }, []);

  const onRefresh = () => { setRefreshing(true); refrescar(); fetchCatalogo(); };

  const abrirCanje = (producto) => {
    setProductoSeleccionado(producto);
    setCanjeVisible(true);
  };

  const confirmarCanje = async () => {
    if (!productoSeleccionado) return;
    setCanjeLoading(true);
    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_BASE_URL}/api/tc-puntos/canjear`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ producto_id: productoSeleccionado.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        Alert.alert("No se pudo canjear", data.message ?? "Intenta de nuevo");
        return;
      }
      fijarBalance(data.balance);
      setCanjeVisible(false);
      Alert.alert(
        "¡Canje exitoso!",
        `Canjeaste "${data.producto}" por ${Number(productoSeleccionado.costo_puntos).toLocaleString()} TC Puntos. Recibiras un correo con mas información`
      );
    } catch (_) {
      Alert.alert("Error", "No se pudo completar el canje");
    } finally {
      setCanjeLoading(false);
    }
  };

  if (loading) {
    return (
      <FooterLayout>
        <HeaderUser title="TC Puntos" subtitle="Programa de recompensas" />
        <View className="flex-1 items-center justify-center bg-white">
          <ActivityIndicator size="large" color="#fdc834" />
        </View>
      </FooterLayout>
    );
  }

  const hayProductos = categorias.some((c) => c.productos?.length > 0);

  return (
    <FooterLayout>
      <HeaderUser title="TC Puntos" subtitle="Programa de recompensas" />

      <ScrollView
        className="flex-1 bg-gray-50"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#fdc834"]} tintColor="#fdc834" />
        }
      >
        <BalanceCard
          balance={balance}
          valorPunto={valorPunto}
          onInfoPress={() => setInfoVisible(true)}
        />

        <View className="pt-4 pb-8">
          {!hayProductos ? (
            <View className="items-center px-8 py-12">
              <TcPuntoIcon size={56} />
              <Text className="text-xl font-bold text-black mt-5 mb-2 text-center">Próximamente</Text>
              <Text className="text-gray-400 text-sm text-center leading-6">
                Aquí encontrarás productos y promociones exclusivas que podrás canjear con tus TC Puntos.
              </Text>
            </View>
          ) : (
            categorias.map((cat) => (
              <CategoriaSection key={cat.id} categoria={cat} balance={balance} onCanjear={abrirCanje} />
            ))
          )}
        </View>
      </ScrollView>

      <ComoFuncionaModal visible={infoVisible} onClose={() => setInfoVisible(false)} />
      <CanjeModal
        producto={productoSeleccionado}
        balance={balance ?? 0}
        visible={canjeVisible}
        onClose={() => setCanjeVisible(false)}
        onConfirm={confirmarCanje}
        loading={canjeLoading}
      />
    </FooterLayout>
  );
}
