import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { Plus, RefreshCw } from "lucide-react-native";
import FooterLayout from "../FooterLayout/FooterLayout";
import HeaderUser from "../UserDropdown/HeaderUser";
import CuentaSelect from "../Cuentas/CuentasSelect";
import InfoTooltip from "../Cuentas/InfoTooltip";
import SinCuentas from "../Cuentas/SinCuentas";
import { useUser } from "../ContextUser/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../api";
// Modales bancarios
import ModalCuentaBancaria from "../Modales/ModalCuentaBancaria";
import ModalCuentaDestino from "../Modales/ModalCuentaDestino";
// Modal QR
import ModalCuentaQR from "../Modales/ModalCuentaQR";

export default function Cuentas() {
  const { user, loading } = useUser();

  // ── Tipo de vista: "bank" | "qr" ────────────────────────────
  const [tipoVista, setTipoVista] = useState("bank");

  // ── Cuentas bancarias ────────────────────────────────────────
  const [cuentasUsuario, setCuentasUsuario] = useState([]);
  const [loadingCuentas, setLoadingCuentas] = useState(false);
  const [cuentaOrigen, setCuentaOrigen] = useState(null);
  const [cuentaDestino, setCuentaDestino] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [tipoAgregar, setTipoAgregar] = useState("origin");
  const [bancos, setBancos] = useState([]);

  // ── Cuentas QR ───────────────────────────────────────────────
  const [cuentasQR, setCuentasQR] = useState({ PE: null, BO: null });
  const [loadingQR, setLoadingQR] = useState(false);
  const [openModalQR, setOpenModalQR] = useState(false);
  const [qrCountryAgregar, setQrCountryAgregar] = useState("PE");

  // ── Fetch cuentas bancarias ──────────────────────────────────
  useEffect(() => {
    if (!user?.id) return;

    const fetchCuentas = async () => {
      setLoadingCuentas(true);
      try { 
        const token = await AsyncStorage.getItem("token");
        console.log("token para thunder clinet ", token);
        const cache = await AsyncStorage.getItem("cuentasUsuario");
        if (cache) setCuentasUsuario(JSON.parse(cache));

        const res = await fetch(
          `${API_BASE_URL}/api/listar-cuentas?user_id=${user?.id}&type=bank`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          throw new Error("Respuesta inválida del backend");
        }

        const cuentasConBanco = data.map((c) => ({
          ...c,
          bank: bancos.find((b) => b.id === c.bank_id) || null,
        }));

        setCuentasUsuario(cuentasConBanco);
        await AsyncStorage.setItem("cuentasUsuario", JSON.stringify(cuentasConBanco));
        await AsyncStorage.setItem("cuentasUsuario_lastFetch", Date.now().toString());
        console.log("Cuentas bancarias cargadas:", cuentasConBanco);
      } catch (err) {
        console.error("Error cargando cuentas:", err);
      } finally {
        setLoadingCuentas(false);
      }
    };

    fetchCuentas();
  }, [user, bancos]);

  // ── Fetch cuentas QR ─────────────────────────────────────────
  useEffect(() => {
    if (!user?.id || tipoVista !== "qr") return;

    const fetchQR = async () => {
      setLoadingQR(true);
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await fetch(
          `${API_BASE_URL}/api/listar-cuentas?user_id=${user?.id}&type=qr`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Error al cargar QRs");
        const data = await res.json();

        const pe = data.find((c) => c.qr_country === "PE") || null;
        const bo = data.find((c) => c.qr_country === "BO") || null;
        setCuentasQR({ PE: pe, BO: bo });
        console.log("Cuentas QR cargadas:", { PE: pe, BO: bo });
      } catch (err) {
        console.error("Error cargando QRs:", err);
      } finally {
        setLoadingQR(false);
      }
    };

    fetchQR();
  }, [user, tipoVista]);

  const cuentasOrigen = cuentasUsuario.filter((c) => c.account_type === "origin");
  const cuentasDestino = cuentasUsuario.filter((c) => c.account_type === "destination");

  if (loading) return <ActivityIndicator size="large" color="black" className="mt-4" />;

  // ── Render cuentas bancarias ─────────────────────────────────
  const renderCuentas = (cuentas, selectedCuenta, setSelectedCuenta, tipo) => (
    <View className="mb-6">
      <View className="flex-row items-center mb-3">
        <Text className="font-bold text-lg text-black">
          {tipo === "origin" ? "Cuentas de Origen" : "Cuentas de Destino"}
        </Text>
        <InfoTooltip
          texto={
            tipo === "origin"
              ? "Esta es tu cuenta bancaria en Perú (o Bolivia). Desde aquí nos envías el dinero que quieres transferir."
              : "Esta es la cuenta del destinatario en Perú (o Bolivia). A esta cuenta le haremos llegar el dinero."
          }
        />
      </View>

      {loadingCuentas ? (
        <ActivityIndicator color="black" />
      ) : (
        <View>
          {cuentas.length === 0 ? (
            <View className="flex-row items-center gap-3">
              <View className="flex-1">
                <SinCuentas
                  mensaje={
                    tipo === "origin"
                      ? "Aún no tienes cuentas de origen. Agrega una cuenta de un banco (peruano o boliviano) desde la que nos enviarás el dinero."
                      : "Aún no tienes cuentas de destino. Agrega la cuenta del banco (peruano o boliviano) al que quieres enviar el dinero."
                  }
                />
              </View>
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
          ) : (
            <View className="flex-row items-center gap-3">
              <CuentaSelect
                options={cuentas.map((c) => ({
                  ...c,
                  logo_url: c.bank?.logo_url,
                  name: c.bank?.name || c.account_number,
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
          )}

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

  // ── Render tarjeta QR ────────────────────────────────────────
  const renderTarjetaQR = (country) => {
    const cuenta = cuentasQR[country];
    const label = country === "PE" ? "QR Perú (Soles)" : "QR Bolivia (Bolivianos)";
    const bandera = country === "PE" ? "🇵🇪" : "🇧🇴";

    return (
      <View key={country} className="mb-5 bg-gray-50 border border-gray-200 rounded-2xl p-4">
        <View className="flex-row items-center mb-3 gap-2">
          <Text className="text-lg">{bandera}</Text>
          <Text className="font-bold text-base text-black">{label}</Text>
        </View>

        {loadingQR ? (
          <ActivityIndicator color="black" />
        ) : cuenta ? (
          <View className="items-center gap-3">
            <View className="bg-white p-2 rounded-xl shadow border border-gray-100">
              <Image
                source={{ uri: cuenta.qr_value }}
                style={{ width: 160, height: 160 }}
                resizeMode="contain"
              />
            </View>
            <Text className="text-xs text-green-600 font-semibold">QR guardado</Text>
            <TouchableOpacity
              className="flex-row items-center gap-2 border border-gray-300 px-4 py-2 rounded-xl"
              onPress={() => {
                setQrCountryAgregar(country);
                setOpenModalQR(true);
              }}
            >
              <RefreshCw size={14} color="#374151" />
              <Text className="text-gray-700 text-sm font-semibold">Cambiar QR</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="items-center gap-3 py-4">
            <Text className="text-gray-400 text-sm text-center">
              No tienes un QR registrado para {country === "PE" ? "Perú" : "Bolivia"}.
            </Text>
            <TouchableOpacity
              className="flex-row items-center gap-2 bg-black px-5 py-3 rounded-xl"
              onPress={() => {
                setQrCountryAgregar(country);
                setOpenModalQR(true);
              }}
            >
              <Plus size={16} color="#fff" />
              <Text className="text-white font-semibold text-sm">Agregar QR</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <FooterLayout>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }} className="bg-white">
        <HeaderUser title="Mis Cuentas" tabKey="Cuentas" />

        {/* ── Información del usuario ── */}
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

        {/* ── Selector de tipo de cuenta ── */}
        <View className="flex-row bg-gray-100 rounded-2xl p-1 mb-6">
          <TouchableOpacity
            className={`flex-1 py-3 rounded-xl items-center ${tipoVista === "bank" ? "bg-black" : ""}`}
            onPress={() => setTipoVista("bank")}
          >
            <Text className={`font-bold text-sm ${tipoVista === "bank" ? "text-white" : "text-gray-500"}`}>
              🏦 Bancaria
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 rounded-xl items-center ${tipoVista === "qr" ? "bg-black" : ""}`}
            onPress={() => setTipoVista("qr")}
          >
            <Text className={`font-bold text-sm ${tipoVista === "qr" ? "text-white" : "text-gray-500"}`}>
              📷 QR
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Contenido según tipo ── */}
        {tipoVista === "bank" ? (
          <>
            {renderCuentas(cuentasOrigen, cuentaOrigen, setCuentaOrigen, "origin")}
            {renderCuentas(cuentasDestino, cuentaDestino, setCuentaDestino, "destination")}
          </>
        ) : (
          <>
            <Text className="text-sm text-gray-500 mb-4 text-center">
              Registra tu código QR para cada país. Lo usaremos para enviarte el dinero.
            </Text>
            {renderTarjetaQR("PE")}
            {renderTarjetaQR("BO")}
          </>
        )}

        {/* ── Modales bancarios ── */}
        {tipoAgregar === "origin" ? (
          <ModalCuentaBancaria
            isOpen={openModal}
            onClose={() => setOpenModal(false)}
            accountType="origin"
            user={user}
            bancos={bancos}
            onCuentaGuardada={(cuentasActualizadas) => {
              setCuentasUsuario(cuentasActualizadas);
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
              const ultimaCuenta = cuentasActualizadas
                .filter((c) => c.account_type === "destination")
                .pop();
              setCuentaDestino(ultimaCuenta || null);
            }}
          />
        )}

        {/* ── Modal QR ── */}
        <ModalCuentaQR
          isOpen={openModalQR}
          onClose={() => setOpenModalQR(false)}
          user={user}
          qrCountry={qrCountryAgregar}
          onQRGuardado={(cuentaGuardada) => {
            setCuentasQR((prev) => ({
              ...prev,
              [cuentaGuardada.qr_country]: cuentaGuardada,
            }));
          }}
        />
      </ScrollView>
    </FooterLayout>
  );
}
