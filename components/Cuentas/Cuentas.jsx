import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from "react-native";
import { Plus } from "lucide-react-native";
import FooterLayout from "../FooterLayout/FooterLayout";
import HeaderUser from "../UserDropdown/HeaderUser";
import CuentaSelect from "../Cuentas/CuentasSelect";
import { useUser } from "../ContextUser/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Importar modales
import ModalCuentaBancaria from "../Modales/ModalCuentaBancaria";
import ModalCuentaDestino from "../Modales/ModalCuentaDestino";

const screenWidth = Dimensions.get("window").width;

export default function Cuentas() {
  const { user, loading } = useUser();
  const [cuentasUsuario, setCuentasUsuario] = useState([]);
  const [loadingCuentas, setLoadingCuentas] = useState(false);

  const [cuentaOrigen, setCuentaOrigen] = useState(null);
  const [cuentaDestino, setCuentaDestino] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [tipoAgregar, setTipoAgregar] = useState("origin"); // origin o destination
  const [bancos, setBancos] = useState([]);

  // Cargar cuentas del usuario
  useEffect(() => {
    if (!user?.id) return;

    const fetchCuentas = async () => {
      setLoadingCuentas(true);
      try {
        const token = await AsyncStorage.getItem("token");
        const cache = await AsyncStorage.getItem("cuentasUsuario");
        const lastFetch = await AsyncStorage.getItem("cuentasUsuario_lastFetch");
        const now = Date.now();

        if (cache && lastFetch && now - parseInt(lastFetch) < 5 * 60 * 1000) {
          setCuentasUsuario(JSON.parse(cache));
          setLoadingCuentas(false);
          return;
        }

        const res = await fetch(
          `https://panel.transfercash.click/api/listar-cuentas?user_id=${user?.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Error al cargar cuentas");
        const data = await res.json();

        // Asociar objeto banco completo a cada cuenta
        const cuentasConBanco = data.map((c) => ({
          ...c,
          bank: bancos.find((b) => b.id === c.bank_id) || null,
        }));

        setCuentasUsuario(cuentasConBanco);
        await AsyncStorage.setItem("cuentasUsuario", JSON.stringify(cuentasConBanco));
        await AsyncStorage.setItem("cuentasUsuario_lastFetch", now.toString());
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCuentas(false);
      }
    };

    fetchCuentas();
  }, [user, bancos]);

  const cuentasOrigen = cuentasUsuario.filter((c) => c.account_type === "origin");
  const cuentasDestino = cuentasUsuario.filter((c) => c.account_type === "destination");

  if (loading) return <ActivityIndicator size="large" color="black" className="mt-4" />;

  const renderCuentas = (cuentas, selectedCuenta, setSelectedCuenta, tipo) => (
    <View className="mb-6">
      <Text className="font-bold text-lg mb-3 text-black">
        {tipo === "origin" ? "Cuentas de Origen" : "Cuentas de Destino"}
      </Text>

      {loadingCuentas ? (
        <ActivityIndicator color="black" />
      ) : (
        <View>
          <View className="flex-row items-center gap-3">
            <CuentaSelect
              options={cuentas.map(c => ({
                ...c,
                logo_url: c.bank?.logo_url, // usamos la info del banco completo
                name: c.bank?.name || c.account_number
              }))}
              value={selectedCuenta}
              onChange={setSelectedCuenta}
              placeholder="Selecciona cuenta"
            />
            <TouchableOpacity
              className="bg-black rounded-xl justify-center items-center"
              style={{ width: 48, height: 48 }}
              onPress={() => {
                setTipoAgregar(tipo);
                setOpenModal(true);
              }}
            >
              <Plus size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {tipo === "destination" && selectedCuenta && (
            <View className="mt-5 bg-black/90 p-4 rounded-xl">
              <Text className="font-bold text-white text-base text-center mb-2">
                Información del Destinatario
              </Text>
              <View className="flex-row flex-wrap">
                <View className="w-1/2 mb-2">
                  <Text className="text-gray-300 text-sm">Nombre</Text>
                  <Text className="text-white">{selectedCuenta.owner_full_name || "N/A"}</Text>
                </View>
                <View className="w-1/2 mb-2">
                  <Text className="text-gray-300 text-sm">Documento</Text>
                  <Text className="text-white">{selectedCuenta.owner_document || "N/A"}</Text>
                </View>
                <View className="w-1/2">
                  <Text className="text-gray-300 text-sm">Teléfono</Text>
                  <Text className="text-white">{selectedCuenta.owner_phone || "N/A"}</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );

  return (
    <FooterLayout>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }} className="bg-white">
        <HeaderUser title="Cuentas Bancarias" />

        {/* Información del usuario */}
        <View className="bg-black/90 p-5 rounded-xl mb-6">
          <Text className="font-bold text-center text-lg mb-4 text-white">Información del Usuario</Text>
          <View className="flex-row flex-wrap">
            <View className="w-1/2 mb-3">
              <Text className="text-gray-300 text-sm">Nombre</Text>
              <Text className="text-white">
                {user?.first_name || "N/A"} {user?.last_name || ""}
              </Text>
            </View>
            <View className="w-1/2 mb-3">
              <Text className="text-gray-300 text-sm">CI</Text>
              <Text className="text-white">{user?.document_number || "N/A"}</Text>
            </View>
            <View className="w-1/2 mb-3">
              <Text className="text-gray-300 text-sm">Nacionalidad</Text>
              <Text className="text-white">{user?.nationality || "N/A"}</Text>
            </View>
            <View className="w-1/2 mb-3">
              <Text className="text-gray-300 text-sm">KYC</Text>
              <Text className="text-white">{user?.kyc_status || "Pendiente"}</Text>
            </View>
          </View>
        </View>

        {renderCuentas(cuentasOrigen, cuentaOrigen, setCuentaOrigen, "origin")}
        {renderCuentas(cuentasDestino, cuentaDestino, setCuentaDestino, "destination")}

        {/* Modales */}
        {tipoAgregar === "origin" ? (
          <ModalCuentaBancaria
            isOpen={openModal}
            onClose={() => setOpenModal(false)}
            accountType="origin"
            user={user}
            bancos={bancos}
            onCuentaGuardada={(cuentasActualizadas) => {
              setCuentasUsuario(cuentasActualizadas);

              // Seleccionamos la última cuenta agregada
              const ultimaCuenta = cuentasActualizadas[cuentasActualizadas.length - 1];
              setCuentaOrigen(ultimaCuenta);
            }}
          />
        ) : (
          <ModalCuentaDestino
            isOpen={openModal}
            onClose={() => setOpenModal(false)}
            bancos={bancos}
            user={user}
            onCuentaGuardada={(cuentasActualizadas) => {
              setCuentasUsuario(cuentasActualizadas);

              // Seleccionamos la última cuenta agregada
              const ultimaCuenta = cuentasActualizadas.filter(c => c.account_type === "destination").pop();
              setCuentaDestino(ultimaCuenta || null);
            }}
          />
        )}
      </ScrollView>
    </FooterLayout>
  );
}
