import { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Banknote, QrCode, MapPin, ExternalLink, CreditCard } from "lucide-react-native";
import { useUser } from "../ContextUser/UserContext";
import CuentaSelect from "../Cuentas/CuentasSelectTransfenrecias";
import SinCuentas from "../Cuentas/SinCuentas";
import { useTransferMethods } from "../hooks/useTransferMethods";
import API_BASE_URL from "../api";
import ModalCuentaBancaria from "../Modales/ModalCuentaBancaria";
import ModalCuentaDestino from "../Modales/ModalCuentaDestino";
import ModalCuentaQR from "../Modales/ModalCuentaQR";

const OFICINAS = [
  {
    nombre: "Oficina Cochabamba",
    direccion: "Av. Villazón, calle Los Paraisos – frente a UDABOL",
    horario: "Lun–Sáb 8:00–17:00 | Dom solo transferencia/QR",
    linkMapa: "https://maps.app.goo.gl/EnjPUumyYn7hSRxH7",
  },
];
9            
export default function OperacionStep({ onNext, onBack, operacion, setOperacion }) {
  const { user } = useUser();
  const router = useRouter();
  const { modo } = operacion;
  const isOriginBank = modo === "PENtoBOB";
  const isDestinationBank = modo === "BOBtoPEN";

  const [nonBankMethod, setNonBankMethod] = useState(operacion.nonBankMethod ?? null);
  const [juramento, setJuramento] = useState(false);
  const [terminos, setTerminos] = useState(false);

  const [cuentas, setCuentas] = useState([]);
  const [loadingCuentas, setLoadingCuentas] = useState(false);

  const [qrUserAccount, setQrUserAccount] = useState(operacion.cuentaQR ?? null);
  const [loadingQrUser, setLoadingQrUser] = useState(false);

  const [modalAbierto, setModalAbierto] = useState(null);

  const defaultCountryOrigen = modo === "PENtoBOB" ? "peru" : "bolivia";
  const defaultCountryDestino = modo === "PENtoBOB" ? "bolivia" : "peru";

  const { methods: metodosPago } = useTransferMethods(modo);

  // Cargar cuentas bancarias del usuario
  useEffect(() => {
    if (!user?.id) return;
    const fetchCuentas = async () => {
      setLoadingCuentas(true);
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await fetch(
          `${API_BASE_URL}/api/listar-cuentas?user_id=${user.id}&type=bank`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setCuentas(Array.isArray(data) ? data : []);
      } catch {
        setCuentas([]);
      } finally {
        setLoadingCuentas(false);
      }
    };
    fetchCuentas();
  }, [user?.id]);

  const fetchQr = useCallback(async () => {
    if (!user?.id) return;
    setLoadingQrUser(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(
        `${API_BASE_URL}/api/listar-cuentas?user_id=${user.id}&type=qr`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      const found = (data || []).find((c) => c.qr_country === "BO") || null;
      setQrUserAccount(found);
    } catch {
      setQrUserAccount(null);
    } finally {
      setLoadingQrUser(false);
    }
  }, [user?.id]);

  // Cargar QR del usuario (solo PENtoBOB + qr)
  useEffect(() => {
    if (modo !== "PENtoBOB" || nonBankMethod !== "qr") return;
    fetchQr();
  }, [user?.id, modo, nonBankMethod]);

  // Filtros
  const cuentasOrigen = useMemo(
    () =>
      cuentas.filter((c) => {
        if (modo === "PENtoBOB") return c.account_type === "origin" && c.bank_country === "peru";
        if (modo === "BOBtoPEN") return c.account_type === "origin" && c.bank_country === "bolivia";
        return false;
      }),
    [cuentas, modo]
  );


  const cuentasDestino = useMemo(
    () =>
      cuentas.filter((c) => {
        if (modo === "PENtoBOB") return c.account_type === "destination" && c.bank_country === "bolivia";
        if (modo === "BOBtoPEN") return c.account_type === "destination" && c.bank_country === "peru";
        return false;
      }),
    [cuentas, modo]
  );

  const empresaQRBolivia = metodosPago?.find?.((m) => m.type === "qr") ?? null;

  const cuentaOrigen = operacion.cuentaOrigen;
  const cuentaDestino = operacion.cuentaDestino;

  const setCuentaOrigen = (c) => setOperacion((p) => ({ ...p, cuentaOrigen: c }));
  const setCuentaDestino = (c) => setOperacion((p) => ({ ...p, cuentaDestino: c }));

  // Reset método al cambiar modo
  useEffect(() => {
    setNonBankMethod(null);
    setOperacion((p) => ({ ...p, cuentaOrigen: null, cuentaDestino: null, cuentaQR: null }));
  }, [modo]);

  const sideBancoOk = isOriginBank ? !!cuentaOrigen : !!cuentaDestino;
  const sideNoBancoOk =
    nonBankMethod === "cash" ||
    (nonBankMethod === "qr" && modo === "PENtoBOB" && !!qrUserAccount) ||
    (nonBankMethod === "qr" && modo === "BOBtoPEN" && !!empresaQRBolivia && !!cuentaOrigen);

  const puedeSeguir = juramento && terminos && sideBancoOk && sideNoBancoOk;

  const handleSiguiente = () => {
    if (!puedeSeguir) return;
    setOperacion((p) => ({
      ...p,
      nonBankMethod,
      cuentaQR: qrUserAccount,
      metodo: isOriginBank ? nonBankMethod : "transferencia",
    }));
    onNext();
  };

 const renderSeccionBanco = (label, value, setValue, options, tipo) => {
  const getMensaje = () => {
    if (modo === "PENtoBOB") {
      if (tipo === "origen") return "No tienes cuentas bancarias peruanas registradas.";
      if (tipo === "destino") return "No tienes cuentas bancarias bolivianas registradas.";
    }

    if (modo === "BOBtoPEN") {
      if (tipo === "origen") return "No tienes cuentas bancarias bolivianas registradas.";
      if (tipo === "destino") return "No tienes cuentas bancarias peruanas registradas.";
    }

    return "No tienes cuentas disponibles.";
  };

  return (
    <View className="mb-4">
      <Text className="text-black font-semibold mb-2">{label}</Text>

      {loadingCuentas ? (
        <ActivityIndicator size="small" color="#000" />
      ) : options.length === 0 ? (
        <View>
          <SinCuentas mensaje={getMensaje()} />

          <TouchableOpacity
            onPress={() => setModalAbierto(tipo === "origen" ? "origen" : "destino")}
            className="flex-row items-center justify-center gap-2 bg-blue-600 py-3 rounded-lg mt-2"
          >
            <CreditCard size={16} color="#fff" />
            <Text className="text-white font-semibold">Agregar cuenta</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <CuentaSelect
          options={options.map((c) => ({
            id: c.id,
            bank_name: c.bank?.name || "Banco",
            account_number: c.account_number,
            bank_logo: c.bank?.logo,
            ...c,
          }))}
          value={value}
          onChange={setValue}
          placeholder="Selecciona una cuenta"
        />
      )}
    </View>
  );
};

  const renderSeccionNoBanco = (label) => (
    <View className="mb-4">
      <Text className="text-black font-semibold mb-2">{label}</Text>

      <View className="flex-row gap-2 mb-3">
        <TouchableOpacity
          onPress={() => setNonBankMethod("cash")}
          className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-lg border ${
            nonBankMethod === "cash"
              ? "bg-yellow-400 border-yellow-400"
              : "bg-white border-gray-300"
          }`}
        >
          <Banknote size={16} color="#111" />
          <Text className="font-semibold text-gray-800">Efectivo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setNonBankMethod("qr")}
          className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-lg border ${
            nonBankMethod === "qr"
              ? "bg-yellow-400 border-yellow-400"
              : "bg-white border-gray-300"
          }`}
        >
          <QrCode size={16} color="#111" />
          <Text className="font-semibold text-gray-800">QR</Text>
        </TouchableOpacity>
      </View>

      {nonBankMethod === "cash" && (
        <View className="border rounded-lg bg-gray-50 p-3">
          {OFICINAS.map((of, i) => (
            <View key={i} className="gap-1">
              <View className="flex-row items-center gap-1">
                <MapPin size={14} color="#374151" />
                <Text className="font-semibold text-gray-800">{of.nombre}</Text>
              </View>
              <Text className="text-gray-600 text-xs">{of.direccion}</Text>
              <Text className="text-gray-500 text-xs">{of.horario}</Text>
              <TouchableOpacity
                onPress={() => Linking.openURL(of.linkMapa)}
                className="flex-row items-center gap-1 mt-1"
              >
                <ExternalLink size={12} color="#2563eb" />
                <Text className="text-xs text-blue-600">Ver en Google Maps</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {nonBankMethod === "qr" && modo === "PENtoBOB" && (
        <View className="border rounded-lg bg-gray-50 p-3 items-center">
          <Text className="text-xs text-gray-500 mb-2">
            Tu QR para recibir en Bolivia (Bolivianos)
          </Text>
          {loadingQrUser ? (
            <ActivityIndicator size="small" color="#000" />
          ) : qrUserAccount ? (
            <View className="items-center gap-2">
              <View className="bg-white p-2 rounded-xl border">
                <Image
                  source={{ uri: qrUserAccount.qr_value }}
                  style={{ width: 130, height: 130 }}
                  resizeMode="contain"
                />
              </View>
              <Text className="text-xs text-green-600 font-semibold">QR guardado</Text>
              <TouchableOpacity
                onPress={() => setModalAbierto("qr")}
                className="flex-row items-center gap-1"
              >
                <CreditCard size={12} color="#2563eb" />
                <Text className="text-xs text-blue-600">Cambiar QR</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="items-center gap-2">
              <Text className="text-xs text-gray-700 text-center">
                No tienes un QR registrado para Bolivia.
              </Text>
              <TouchableOpacity
                onPress={() => setModalAbierto("qr")}
                className="flex-row items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg"
              >
                <CreditCard size={14} color="#fff" />
                <Text className="text-white font-semibold text-xs">Agregar QR</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-white px-4 py-4">
      <Text className="text-xl font-bold text-black text-center mb-4">
        Registro de Operación
      </Text>

      <View className="border rounded-lg bg-gray-50 p-3 mb-4">
        <Text className="text-black">
          <Text className="font-semibold">Monto: </Text>
          {operacion.monto} {isOriginBank ? "PEN" : "BOB"}
        </Text>
        <Text className="text-black">
          <Text className="font-semibold">Conversión: </Text>
          {operacion.conversion} {isOriginBank ? "BOB" : "PEN"}
        </Text>
        <Text className="text-black">
          <Text className="font-semibold">Tasa: </Text>
          {operacion.tasa}
        </Text>
      </View>

    
      {isOriginBank
        ? renderSeccionBanco("Cuenta Origen", cuentaOrigen, setCuentaOrigen, cuentasOrigen,"origen")
        : renderSeccionNoBanco("¿Cómo pagará sus bolivianos?")}

      {/* Cuenta origen BO adicional cuando BOBtoPEN + qr */}
      {modo === "BOBtoPEN" && nonBankMethod === "qr" &&
        renderSeccionBanco(
          "Cuenta desde la que pagarás (Bolivia)",
          cuentaOrigen,
          setCuentaOrigen,
          cuentasOrigen,"origen"
        )}

     
      {isDestinationBank
        ? renderSeccionBanco("Cuenta Destino", cuentaDestino, setCuentaDestino, cuentasDestino,"destino")
        : renderSeccionNoBanco("¿Cómo quiere recibir sus bolivianos?")}

   
      <View className="gap-2 mb-4">
        <TouchableOpacity
          onPress={() => setJuramento(!juramento)}
          className="flex-row items-start gap-2"
        >
          <View
            className={`w-5 h-5 rounded border-2 ${
              juramento ? "bg-yellow-400 border-yellow-400" : "border-gray-400"
            }`}
          />
          <Text className="flex-1 text-xs text-gray-700">
            Declaro bajo juramento que la información registrada es veraz y exacta.
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTerminos(!terminos)}
          className="flex-row items-start gap-2"
        >
          <View
            className={`w-5 h-5 rounded border-2 ${
              terminos ? "bg-yellow-400 border-yellow-400" : "border-gray-400"
            }`}
          />
          <Text className="flex-1 text-xs text-gray-700">
            Acepto los Términos y condiciones y la Política de privacidad.
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between mt-4 mb-8">
        <TouchableOpacity onPress={onBack} className="bg-gray-300 px-6 py-3 rounded-lg">
          <Text className="text-black font-semibold">Atrás</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSiguiente}
          disabled={!puedeSeguir}
          className={`px-6 py-3 rounded-lg ${puedeSeguir ? "bg-yellow-400" : "bg-gray-300"}`}
        >
          <Text className="text-black font-bold">Siguiente</Text>
        </TouchableOpacity>
      </View>

      <ModalCuentaBancaria
        isOpen={modalAbierto === "origen"}
        onClose={() => setModalAbierto(null)}
        user={user}
        accountType="origin"
        defaultCountry={defaultCountryOrigen}
        onCuentaGuardada={(lista) => { setCuentas(lista); setModalAbierto(null); }}
      />
      <ModalCuentaDestino
        isOpen={modalAbierto === "destino"}
        onClose={() => setModalAbierto(null)}
        user={user}
        defaultCountry={defaultCountryDestino}
        onCuentaGuardada={(lista) => { setCuentas(lista); setModalAbierto(null); }}
      />
      <ModalCuentaQR
        isOpen={modalAbierto === "qr"}
        onClose={() => setModalAbierto(null)}
        user={user}
        qrCountry="BO"
        onQRGuardado={() => { fetchQr(); setModalAbierto(null); }}
      />

    </ScrollView>
  );
}
