import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Modal,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import FooterLayout from "../FooterLayout/FooterLayout";
import HeaderUser from "../UserDropdown/HeaderUser";
import TcPuntoIcon from "./TcPuntoIcon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../api";

async function authHeaders() {
  const token = await AsyncStorage.getItem("token");
  return { Authorization: `Bearer ${token}`, Accept: "application/json" };
}

// ─── Balance card ────────────────────────────────────────────

function BalanceCard({ balance, valorPunto }) {
  return (
    <View className="items-center pt-8 pb-6 px-6 bg-white border-b border-gray-100">
      <TcPuntoIcon size={72} />
      <Text className="text-5xl font-bold text-black mt-4">
        {balance !== null ? balance : "—"}
      </Text>
      <Text className="text-gray-500 text-sm mt-1 font-medium">
        TC Puntos acumulados
      </Text>
      {valorPunto !== null && (
        <View className="mt-3 bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-1.5">
          <Text className="text-yellow-700 text-xs font-semibold">
            1 TC Punto = S/ {Number(valorPunto).toFixed(2)}
          </Text>
        </View>
      )}
    </View>
  );
}

// ─── Producto card — full width ──────────────────────────────

function ProductoCard({ producto, balance, onCanjear }) {
  const sinSaldo = balance !== null && balance < producto.costo_puntos;
  const sinStock = producto.stock !== null && producto.stock <= 0;
  const disabled = sinSaldo || sinStock;

  return (
    <View className="bg-white rounded-2xl overflow-hidden mb-3 mx-4 border border-gray-100">
      {/* Banner imagen full width */}
      {producto.imagen_url ? (
        <Image
          source={{ uri: producto.imagen_url }}
          style={{ width: "100%", height: 200 }}
          resizeMode="cover"
        />
      ) : (
        <View className="bg-yellow-50 items-center justify-center" style={{ height: 180 }}>
          <TcPuntoIcon size={64} />
        </View>
      )}

      {/* Info debajo */}
      <View className="p-4">
        <Text className="text-lg font-bold text-gray-900">{producto.nombre}</Text>
        {!!producto.descripcion && (
          <Text className="text-gray-500 text-sm mt-1 leading-5">
            {producto.descripcion}
          </Text>
        )}

        <View className="flex-row items-center justify-between mt-4">
          <View className="flex-row items-center gap-1.5 bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1.5">
            <TcPuntoIcon size={16} />
            <Text className="text-yellow-700 font-bold text-sm">
              {Number(producto.costo_puntos).toLocaleString()} pts
            </Text>
          </View>

          {sinStock ? (
            <View className="bg-gray-100 rounded-xl px-5 py-2.5">
              <Text className="text-gray-400 text-sm font-semibold">Sin stock</Text>
            </View>
          ) : (
            <Pressable
              onPress={() => onCanjear(producto)}
              disabled={disabled}
              className={`rounded-xl px-5 py-2.5 ${
                disabled ? "bg-gray-100" : "bg-yellow-400 active:bg-yellow-500"
              }`}
            >
              <Text className={`font-bold text-sm ${disabled ? "text-gray-400" : "text-black"}`}>
                {sinSaldo ? "Puntos insuficientes" : "Canjear"}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

// ─── Categoría sección — banner full width ───────────────────

function CategoriaSection({ categoria, balance, onCanjear }) {
  if (!categoria.productos || categoria.productos.length === 0) return null;

  return (
    <View className="mb-6">
      {/* Banner categoría full width */}
      <View className="mx-4 rounded-2xl overflow-hidden mb-4">
        {categoria.imagen_url ? (
          <View>
            <Image
              source={{ uri: categoria.imagen_url }}
              style={{ width: "100%", height: 140 }}
              resizeMode="cover"
            />
            {/* Overlay con nombre */}
            <View
              className="absolute bottom-0 left-0 right-0 px-4 py-3"
              style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
            >
              <Text className="text-white text-xl font-bold">{categoria.nombre}</Text>
              {!!categoria.descripcion && (
                <Text className="text-white/80 text-xs mt-0.5">{categoria.descripcion}</Text>
              )}
            </View>
          </View>
        ) : (
          <View className="bg-yellow-400 px-5 py-5 rounded-2xl">
            <Text className="text-black text-xl font-bold">{categoria.nombre}</Text>
            {!!categoria.descripcion && (
              <Text className="text-black/70 text-sm mt-0.5">{categoria.descripcion}</Text>
            )}
          </View>
        )}
      </View>

      {/* Productos de esta categoría */}
      {categoria.productos.map((p) => (
        <ProductoCard
          key={p.id}
          producto={p}
          balance={balance}
          onCanjear={onCanjear}
        />
      ))}
    </View>
  );
}

// ─── Modal confirmación de canje ─────────────────────────────

function CanjeModal({ producto, balance, visible, onClose, onConfirm, loading }) {
  if (!producto) return null;
  const nuevoBalance = balance - producto.costo_puntos;

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl overflow-hidden">
          {producto.imagen_url ? (
            <Image
              source={{ uri: producto.imagen_url }}
              style={{ width: "100%", height: 200 }}
              resizeMode="cover"
            />
          ) : (
            <View className="bg-yellow-50 items-center py-10">
              <TcPuntoIcon size={72} />
            </View>
          )}

          <View className="p-6">
            <Text className="text-2xl font-bold text-gray-900">{producto.nombre}</Text>
            {!!producto.descripcion && (
              <Text className="text-gray-500 text-sm mt-1 mb-4">{producto.descripcion}</Text>
            )}

            <View className="bg-gray-50 rounded-2xl p-4 mb-5 mt-2">
              <Row label="Costo" value={`${Number(producto.costo_puntos).toLocaleString()} pts`} />
              <Row label="Tu saldo" value={`${balance} pts`} />
              <View className="h-px bg-gray-200 my-2" />
              <Row
                label="Saldo tras canje"
                value={`${nuevoBalance} pts`}
                bold
                color="text-yellow-600"
              />
            </View>

            <View className="flex-row gap-3">
              <Pressable
                onPress={onClose}
                disabled={loading}
                className="flex-1 border border-gray-200 rounded-2xl py-3.5 items-center"
              >
                <Text className="text-gray-600 font-semibold">Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={onConfirm}
                disabled={loading}
                className="flex-1 bg-yellow-400 rounded-2xl py-3.5 items-center active:bg-yellow-500"
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <Text className="text-black font-bold">Confirmar canje</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function Row({ label, value, bold, color = "text-gray-800" }) {
  return (
    <View className="flex-row justify-between items-center py-0.5">
      <Text className="text-gray-500 text-sm">{label}</Text>
      <Text className={`text-sm ${bold ? "font-bold" : "font-medium"} ${color}`}>{value}</Text>
    </View>
  );
}

// ─── Pantalla principal ──────────────────────────────────────

export default function TcPuntos() {
  const [balance, setBalance]       = useState(null);
  const [valorPunto, setValorPunto] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [modalVisible, setModalVisible]                 = useState(false);
  const [canjeLoading, setCanjeLoading]                 = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const headers = await authHeaders();
      const [saldoRes, catalogoRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/tc-puntos/saldo`, { headers }),
        fetch(`${API_BASE_URL}/api/tc-puntos/catalogo`, { headers }),
      ]);
      if (saldoRes.ok) {
        const d = await saldoRes.json();
        setBalance(d.balance ?? 0);
        setValorPunto(d.valor_punto ?? 1);
      }
      if (catalogoRes.ok) setCategorias(await catalogoRes.json());
    } catch (_) {}
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetchData(); }, []);

  const onRefresh = () => { setRefreshing(true); fetchData(); };

  const abrirCanje = (producto) => {
    setProductoSeleccionado(producto);
    setModalVisible(true);
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
      setBalance(data.balance);
      setModalVisible(false);
      Alert.alert(
        "¡Canje exitoso!",
        `Canjeaste "${data.producto}" por ${Number(productoSeleccionado.costo_puntos).toLocaleString()} TC Puntos.`
      );
    } catch (_) {
      Alert.alert("Error", "No se pudo completar el canje");
    } finally {
      setCanjeLoading(false); }
  };

  const hayProductos = categorias.some((c) => c.productos?.length > 0);

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

  return (
    <FooterLayout>
      <HeaderUser title="TC Puntos" subtitle="Programa de recompensas" />

      <ScrollView
        className="flex-1 bg-gray-50"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#fdc834"]}
            tintColor="#fdc834"
          />
        }
      >
        <BalanceCard balance={balance} valorPunto={valorPunto} />

        <View className="pt-5 pb-8">
          {!hayProductos ? (
            <View className="items-center px-8 py-12">
              <TcPuntoIcon size={56} />
              <Text className="text-xl font-bold text-black mt-5 mb-2 text-center">
                Próximamente
              </Text>
              <Text className="text-gray-400 text-sm text-center leading-6">
                Aquí encontrarás productos y promociones exclusivas que podrás
                canjear con tus TC Puntos.
              </Text>
            </View>
          ) : (
            categorias.map((cat) => (
              <CategoriaSection
                key={cat.id}
                categoria={cat}
                balance={balance}
                onCanjear={abrirCanje}
              />
            ))
          )}
        </View>
      </ScrollView>

      <CanjeModal
        producto={productoSeleccionado}
        balance={balance ?? 0}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={confirmarCanje}
        loading={canjeLoading}
      />
    </FooterLayout>
  );
}
