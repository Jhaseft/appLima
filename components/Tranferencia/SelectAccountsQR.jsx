import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../ContextUser/UserContext";
import API_BASE_URL from "../api";

const QR_COUNTRY_POR_MODO = { PENtoBOB: "BO", BOBtoPEN: "PE" };

export default function SelectAccountsQR({ onNext, onBack, operacion, setOperacion }) {
  const { user } = useUser();
  const [token, setToken] = useState(null);

  const [cuentaQR, setCuentaQR] = useState(operacion.cuentaQR ?? null);
  const [loadingCuenta, setLoadingCuenta] = useState(false);

  const qrCountry = QR_COUNTRY_POR_MODO[operacion.modo] ?? "PE";

  useEffect(() => {
    AsyncStorage.getItem("token").then(setToken);
  }, []);

  useEffect(() => {
    if (!token || !user?.id) return;

    const fetchQR = async () => {
      setLoadingCuenta(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/listar-cuentas?user_id=${user?.id}&type=qr`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        const encontrada = data.find((c) => c.qr_country === qrCountry) || null;
        setCuentaQR(encontrada);
        setOperacion((prev) => ({ ...prev, cuentaQR: encontrada }));
      } catch {
        setCuentaQR(null);
        setOperacion((prev) => ({ ...prev, cuentaQR: null }));
      } finally {
        setLoadingCuenta(false);
      }
    };

    fetchQR();
  }, [token, user?.id, qrCountry]);

  const handleNext = () => {
    if (!cuentaQR) return;
    onNext();
  };

  return (
    <ScrollView className="flex-1 bg-white px-4 py-4">
      <Text className="text-xl font-bold text-black text-center mb-4">
        Selección de Cuenta QR
      </Text>

      <View className="border border-gray-200 rounded-2xl p-4 mb-4">
        <Text className="font-bold text-gray-800 mb-3">
          Tu QR para recibir en{" "}
          {qrCountry === "PE" ? "Perú (Soles)" : "Bolivia (Bolivianos)"}
        </Text>

        {loadingCuenta ? (
          <View className="items-center py-6">
            <ActivityIndicator color="black" />
            <Text className="text-gray-400 text-xs mt-2">Verificando tu QR...</Text>
          </View>
        ) : cuentaQR ? (
          <View className="items-center gap-3">
            <View className="bg-white p-2 rounded-xl border border-gray-100 shadow">
              <Image
                source={{ uri: cuentaQR.qr_value }}
                style={{ width: 150, height: 150 }}
                resizeMode="contain"
              />
            </View>
            <Text className="text-xs text-green-600 font-semibold">QR guardado</Text>
          </View>
        ) : (
          <View className="gap-2 items-center py-4">
            <Text className="text-sm text-gray-700 text-center font-semibold">
              No tienes un QR registrado para{" "}
              {qrCountry === "PE" ? "Perú (Soles)" : "Bolivia (Bolivianos)"}.
            </Text>
            <Text className="text-sm text-gray-500 text-center">
              Debes crearlo en el apartado de{" "}
              <Text className="font-semibold text-gray-700">Cuentas</Text> antes de
              continuar con la transferencia.
            </Text>
          </View>
        )}
      </View>

      <View className="flex-row justify-between mt-6 mb-4">
        <TouchableOpacity
          onPress={onBack}
          className="bg-gray-300 px-6 py-3 rounded-lg"
        >
          <Text className="text-black font-semibold">Atrás</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          disabled={!cuentaQR}
          className={`px-6 py-3 rounded-lg ${
            cuentaQR ? "bg-yellow-400" : "bg-gray-300"
          }`}
        >
          <Text className="text-black font-bold">Siguiente</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
