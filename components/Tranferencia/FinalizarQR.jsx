import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  Clipboard,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import API_BASE_URL from "../api";

// Opciones de pago de la empresa según modo (espejo del web)
const OPCIONES_PAGO = {
  BOBtoPEN: [
    {
      type: "qr",
      title: "QR Bolivia",
      image: "https://res.cloudinary.com/dnbklbswg/image/upload/v1756359417/qr_hgokvi.jpg",
    },
  ],
  PENtoBOB: [
    {
      type: "Yape",
      title: "Yape Perú",
      number: "947847817",
      image: "https://res.cloudinary.com/dnbklbswg/image/upload/v1756359619/yape-logo-png_seeklogo-504685_tns3su.png",
    },
    {
      type: "Plin",
      title: "Plin Perú",
      number: "947847817",
      image: "https://res.cloudinary.com/dnbklbswg/image/upload/v1756359595/plin_fi3i8u.png",
    },
    {
      type: "InterBank",
      title: "InterBank Perú",
      number: "4403006144735",
      image: "https://res.cloudinary.com/dnbklbswg/image/upload/v1756305466/download_zxsiny.png",
    },
    {
      type: "BCP",
      title: "BCP Perú",
      number: "2207063622037",
      image: "https://res.cloudinary.com/dnbklbswg/image/upload/v1756304903/bcp_mtkdyl.png",
    },
  ],
};

// Para PENtoBOB: usuario paga en Perú → qrCountry "PE"
// Para BOBtoPEN: usuario paga en Bolivia → qrCountry "BO"
const QR_COUNTRY_POR_MODO = { PENtoBOB: "PE", BOBtoPEN: "BO" };

export default function FinalizarQR({ onBack, operacion }) {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [paso, setPaso] = useState(1);

  // ── Paso 1: QR del usuario ──────────────────────────────────
  const [cuentaQR, setCuentaQR] = useState(null);
  const [loadingCuenta, setLoadingCuenta] = useState(false);
  const [imagenQR, setImagenQR] = useState(null);
  const [subiendoQR, setSubiendoQR] = useState(false);
  const [errorQR, setErrorQR] = useState("");
  const [mostrarCambiar, setMostrarCambiar] = useState(false);

  // ── Paso 2: comprobante ────────────────────────────────────
  const [comprobante, setComprobante] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const qrCountry = QR_COUNTRY_POR_MODO[operacion.modo] ?? "PE";
  const opciones = OPCIONES_PAGO[operacion.modo] ?? [];
  const isBOBtoPEN = operacion.modo === "BOBtoPEN";
  const montoTexto = isBOBtoPEN ? `${operacion.monto} BOB` : `${operacion.monto} PEN`;
  const conversionTexto = isBOBtoPEN
    ? `${operacion.conversion} PEN`
    : `${operacion.conversion} BOB`;

  useEffect(() => {
    AsyncStorage.getItem("token").then(setToken);
  }, []);

  // Cargar QR del usuario al montar
  useEffect(() => {
    if (!token || !operacion.modo) return;

    const fetchQR = async () => {
      setLoadingCuenta(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/listar-cuentas/${operacion.userId}/qr`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        const encontrada = data.find((c) => c.qr_country === qrCountry) || null;
        setCuentaQR(encontrada);
      } catch {
        setCuentaQR(null);
      } finally {
        setLoadingCuenta(false);
      }
    };

    fetchQR();
  }, [token, operacion.modo]);

  // ── Subir imagen QR del usuario ─────────────────────────────
  const handlePickQR = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ["image/jpeg", "image/png", "image/jpg"],
        copyToCacheDirectory: true,
      });
      if (res.canceled) return;
      setImagenQR(res.assets?.[0] || res);
      setErrorQR("");
    } catch (err) {
      setErrorQR("No se pudo seleccionar la imagen.");
    }
  };

  const handleGuardarQR = async () => {
    if (!imagenQR) { setErrorQR("Selecciona una imagen."); return; }
    setSubiendoQR(true);
    setErrorQR("");
    try {
      const formData = new FormData();
      formData.append("user_id", operacion.userId);
      formData.append("method_type", "qr");
      formData.append("qr_country", qrCountry);
      formData.append("qr_image", {
        uri: imagenQR.uri,
        name: imagenQR.name || "qr.jpg",
        type: imagenQR.mimeType || "image/jpeg",
      });

      const res = await fetch(`${API_BASE_URL}/api/operacion/guardar-cuenta`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al guardar el QR.");

      setCuentaQR({ id: data.id, qr_value: data.qr_value, qr_country: data.qr_country });
      setMostrarCambiar(false);
      setImagenQR(null);
    } catch (err) {
      setErrorQR(err.message || "Error al guardar el QR.");
    } finally {
      setSubiendoQR(false);
    }
  };

  // ── Subir comprobante ────────────────────────────────────────
  const handlePickComprobante = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });
      if (res.canceled) return;
      setComprobante(res.assets?.[0] || res);
      setError("");
    } catch (err) {
      setError("No se pudo seleccionar el comprobante: " + err.message);
    }
  };

  // ── Enviar operación ─────────────────────────────────────────
  const handleEnviar = async () => {
    if (!comprobante) { setError("Sube el comprobante del pago."); return; }
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("amount", operacion.monto);
      formData.append("modo", operacion.modo);
      formData.append("payment_method_slug", "qr");
      formData.append("destination_account_id", cuentaQR.id);
      formData.append("comprobante", {
        uri: comprobante.uri,
        name: comprobante.name || "comprobante.jpg",
        type: comprobante.mimeType || "image/jpeg",
      });

      const res = await fetch(`${API_BASE_URL}/api/operacion/crear-transferencia`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al registrar la operación.");

      Alert.alert(
        "Operación Registrada",
        `Tu operación QR fue registrada.\nN° de operación: ${data.transfer_number}`,
        [{ text: "OK", onPress: () => router.replace("/") }]
      );
    } catch (err) {
      setError(err.message || "Error al enviar el comprobante.");
    } finally {
      setLoading(false);
    }
  };

  // ── Resumen operación ────────────────────────────────────────
  const ResumenOperacion = () => (
    <View className="border border-gray-200 rounded-xl bg-gray-50 p-4 mb-4">
      <View className="flex-row mb-1">
        <Text className="font-semibold text-sm text-gray-700 w-36">Conversión:</Text>
        <Text className="text-sm text-gray-600 flex-1">
          {isBOBtoPEN ? "Bolivianos → Soles" : "Soles → Bolivianos"}
        </Text>
      </View>
      <View className="flex-row mb-1">
        <Text className="font-semibold text-sm text-gray-700 w-36">Monto a enviar:</Text>
        <Text className="text-sm text-gray-600">{montoTexto}</Text>
      </View>
      <View className="flex-row mb-1">
        <Text className="font-semibold text-sm text-gray-700 w-36">Monto a recibir:</Text>
        <Text className="text-sm text-green-600 font-semibold">{conversionTexto}</Text>
      </View>
      <View className="flex-row">
        <Text className="font-semibold text-sm text-gray-700 w-36">Tipo de cambio:</Text>
        <Text className="text-sm text-gray-600">{operacion.tasa}</Text>
      </View>
    </View>
  );

  // ── Indicador de pasos ───────────────────────────────────────
  const PasoIndicador = () => (
    <View className="flex-row items-center justify-center gap-2 mb-4">
      <View
        className={`w-7 h-7 rounded-full items-center justify-center ${
          paso === 1 ? "bg-black" : "bg-green-500"
        }`}
      >
        <Text className="text-white text-xs font-bold">1</Text>
      </View>
      <View className={`h-0.5 w-12 ${paso === 2 ? "bg-black" : "bg-gray-300"}`} />
      <View
        className={`w-7 h-7 rounded-full items-center justify-center ${
          paso === 2 ? "bg-black" : "bg-gray-300"
        }`}
      >
        <Text className={`text-xs font-bold ${paso === 2 ? "text-white" : "text-gray-500"}`}>
          2
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-white px-4 py-4">
      <Text className="text-xl font-bold text-black text-center mb-2">Pago por QR</Text>
      <PasoIndicador />
      <Text className="text-xs text-gray-400 text-center mb-4">
        {paso === 1 ? "Tu QR de cobro" : "Realizar pago y adjuntar comprobante"}
      </Text>

      <ResumenOperacion />

      {/* ════════════════════════════════════════ */}
      {/* PASO 1 — QR del usuario                  */}
      {/* ════════════════════════════════════════ */}
      {paso === 1 && (
        <View className="border border-gray-200 rounded-2xl p-4 mb-4">
          <Text className="font-bold text-gray-800 mb-3">
            📷 Tu QR para recibir en {qrCountry === "PE" ? "🇵🇪 Perú (Soles)" : "🇧🇴 Bolivia (Bolivianos)"}
          </Text>

          {loadingCuenta ? (
            <View className="items-center py-6">
              <ActivityIndicator color="black" />
              <Text className="text-gray-400 text-xs mt-2">Verificando tu QR...</Text>
            </View>
          ) : cuentaQR && !mostrarCambiar ? (
            <View className="items-center gap-3">
              <View className="bg-white p-2 rounded-xl border border-gray-100 shadow">
                <Image
                  source={{ uri: cuentaQR.qr_value }}
                  style={{ width: 150, height: 150 }}
                  resizeMode="contain"
                />
              </View>
              <Text className="text-xs text-green-600 font-semibold">QR guardado</Text>
              <TouchableOpacity
                onPress={() => { setMostrarCambiar(true); setImagenQR(null); setErrorQR(""); }}
                className="flex-row items-center gap-1 border border-gray-300 px-4 py-2 rounded-xl"
              >
                <Text className="text-gray-600 text-sm">🔄 Cambiar QR</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="gap-3">
              <Text className="text-sm text-gray-500">
                {mostrarCambiar
                  ? "Sube la nueva imagen de tu QR."
                  : "No tienes un QR guardado. Súbelo para continuar."}
              </Text>
              <TouchableOpacity
                onPress={handlePickQR}
                className="border-2 border-dashed border-gray-300 rounded-xl p-4 items-center"
              >
                {imagenQR ? (
                  <View className="items-center gap-1">
                    <Image
                      source={{ uri: imagenQR.uri }}
                      style={{ width: 120, height: 120, borderRadius: 8 }}
                      resizeMode="contain"
                    />
                    <Text className="text-xs text-gray-500 mt-1">{imagenQR.name}</Text>
                  </View>
                ) : (
                  <>
                    <Text className="text-3xl mb-1">📷</Text>
                    <Text className="text-sm text-gray-500">Toca para seleccionar imagen</Text>
                  </>
                )}
              </TouchableOpacity>

              {errorQR ? <Text className="text-red-500 text-xs">{errorQR}</Text> : null}

              <View className="flex-row gap-2 justify-end">
                {mostrarCambiar && (
                  <TouchableOpacity
                    onPress={() => { setMostrarCambiar(false); setImagenQR(null); }}
                    className="border border-gray-300 px-4 py-2 rounded-xl"
                  >
                    <Text className="text-gray-600 text-sm">Cancelar</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={handleGuardarQR}
                  disabled={subiendoQR || !imagenQR}
                  className={`flex-row items-center gap-1 px-4 py-2 rounded-xl ${
                    imagenQR && !subiendoQR ? "bg-blue-600" : "bg-blue-300"
                  }`}
                >
                  {subiendoQR ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text className="text-white text-sm font-semibold">Guardar QR</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}

      {/* ════════════════════════════════════════ */}
      {/* PASO 2 — QR empresa + comprobante        */}
      {/* ════════════════════════════════════════ */}
      {paso === 2 && (
        <View className="gap-4">
          <Text className="font-semibold text-gray-800 text-center">
            Realiza el depósito de{" "}
            <Text className="text-green-600 font-bold">{montoTexto}</Text>
          </Text>

          {opciones.map((op, idx) => {
            if (op.type === "qr") {
              return (
                <View key={idx} className="items-center gap-2">
                  <Text className="font-semibold text-sm">Escanea el QR para transferir</Text>
                  <View className="bg-white p-3 rounded-xl border border-gray-100 shadow">
                    <Image
                      source={{ uri: op.image }}
                      style={{ width: 180, height: 180 }}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              );
            }
            return (
              <View key={idx} className="flex-row items-center gap-3 border border-gray-200 rounded-xl p-3">
                <Image
                  source={{ uri: op.image }}
                  style={{ width: 48, height: 48 }}
                  resizeMode="contain"
                />
                <View className="flex-1">
                  <Text className="font-bold text-gray-800 text-sm">{op.title}</Text>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-sm text-gray-600">Número: </Text>
                    <Text className="font-mono text-sm">{op.number}</Text>
                    <TouchableOpacity onPress={() => Clipboard.setString(op.number)}>
                      <Text className="text-blue-600 text-xs">Copiar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}

          {/* Subir comprobante */}
          <TouchableOpacity
            onPress={handlePickComprobante}
            className="border-2 border-dashed border-gray-300 rounded-xl p-4 items-center mt-2"
          >
            {comprobante ? (
              comprobante.mimeType?.startsWith("image/") ? (
                <View className="items-center gap-1">
                  <Image
                    source={{ uri: comprobante.uri }}
                    style={{ width: 140, height: 140, borderRadius: 8 }}
                  />
                  <Text className="text-xs text-green-600 mt-1">Toca para cambiar</Text>
                </View>
              ) : (
                <Text className="text-gray-700">📄 {comprobante.name}</Text>
              )
            ) : (
              <>
                <Text className="text-3xl mb-1">📎</Text>
                <Text className="text-sm text-gray-500 font-semibold">Subir comprobante de pago</Text>
                <Text className="text-xs text-gray-400 mt-1">Imagen o PDF</Text>
              </>
            )}
          </TouchableOpacity>

          {error ? <Text className="text-red-500 text-xs text-center">{error}</Text> : null}
        </View>
      )}

      {/* ── Botones de navegación ── */}
      <View className="flex-row justify-between mt-6 mb-4">
        <TouchableOpacity
          onPress={paso === 1 ? onBack : () => setPaso(1)}
          className="bg-gray-300 px-6 py-3 rounded-lg"
        >
          <Text className="text-black font-semibold">Atrás</Text>
        </TouchableOpacity>

        {paso === 1 ? (
          <TouchableOpacity
            onPress={() => setPaso(2)}
            disabled={!cuentaQR || mostrarCambiar}
            className={`px-6 py-3 rounded-lg ${
              cuentaQR && !mostrarCambiar ? "bg-yellow-400" : "bg-gray-300"
            }`}
          >
            <Text className="text-black font-bold">Siguiente</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleEnviar}
            disabled={!comprobante || loading}
            className={`px-6 py-3 rounded-lg ${
              comprobante && !loading ? "bg-black" : "bg-gray-300"
            }`}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-white font-bold">Finalizar</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}
