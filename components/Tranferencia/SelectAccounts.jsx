import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../ContextUser/UserContext";
import CuentaSelect from "../Cuentas/CuentasSelect";

export default function SelectAccounts({ onNext, onBack, operacion, setOperacion }) {
  const { user } = useUser();
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Traer cuentas desde la API o caché
  useEffect(() => {
    if (!user?.id) return;

    const fetchCuentas = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");
        const cache = await AsyncStorage.getItem("cuentasUsuario");
        const lastFetch = await AsyncStorage.getItem("cuentasUsuario_lastFetch");
        const now = Date.now();

        if (cache && lastFetch && now - parseInt(lastFetch) < 5 * 60 * 1000) {
          setCuentas(JSON.parse(cache));
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

        setCuentas(data);

        await AsyncStorage.setItem("cuentasUsuario", JSON.stringify(data));
        await AsyncStorage.setItem("cuentasUsuario_lastFetch", now.toString());
      } catch (err) {
        console.error("Error cargando cuentas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCuentas();
  }, [user]);

  const cuentasOrigen = cuentas.filter((c) => {
  if (operacion.modo === "PENtoBOB") {
    // origen → Perú
    return c.account_type === "origin" && c.bank_country === "peru";
  } else if (operacion.modo === "BOBtoPEN") {
    // origen → Bolivia
    return c.account_type === "origin" && c.bank_country === "bolivia";
  }
  return false;
});

const cuentasDestino = cuentas.filter((c) => {
  if (operacion.modo === "PENtoBOB") {
    // destino → Bolivia
    return c.account_type === "destination" && c.bank_country === "bolivia";
  } else if (operacion.modo === "BOBtoPEN") {
    // destino → Perú
    return c.account_type === "destination" && c.bank_country === "peru";
  }
  return false;
});

  const handleNext = () => {
    if (!operacion.cuentaOrigen || !operacion.cuentaDestino) return;

    
    onNext();
  };
  
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="black" />
        <Text className="text-gray-700 mt-2">Cargando cuentas...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      <Text className="text-xl font-bold text-black mb-4 text-center">
        Selección de Cuentas
      </Text>

      {/* Cuenta Origen */}
      <Text className="text-black font-semibold mb-2">Cuenta Origen</Text>
      <CuentaSelect
        options={cuentasOrigen.map((c) => ({
          id: c.id,
          bank_name: c.bank?.name || "Banco",
          account_number: c.account_number,
          bank_logo: c.bank?.logo, // ajusta el nombre del campo real en tu BD/API
          ...c,
        }))}
        value={operacion.cuentaOrigen}
        onChange={(cuenta) =>
          setOperacion((prev) => ({ ...prev, cuentaOrigen: cuenta }))
        }
        placeholder="Selecciona una cuenta de origen"
      />
      {/* Cuenta Destino */}
      <Text className="text-black font-semibold mt-6 mb-2">Cuenta Destino</Text>
      <CuentaSelect
        options={cuentasDestino.map((c) => ({
          id: c.id,
          bank_name: c.bank?.name || "Banco",
          account_number: c.account_number,
          bank_logo: c.bank?.logo,
          ...c,
        }))}
        value={operacion.cuentaDestino}
        onChange={(cuenta) =>
          setOperacion((prev) => ({ ...prev, cuentaDestino: cuenta }))
        }
        placeholder="Selecciona una cuenta de destino"
      />

      {/* Botones */}
      <View className="flex-row justify-between mt-10">
        <TouchableOpacity
          onPress={onBack}
          className="bg-gray-300 px-6 py-3 rounded-lg"
        >
          <Text className="text-black font-semibold">Atrás</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          disabled={!operacion.cuentaOrigen || !operacion.cuentaDestino}
          className={`px-6 py-3 rounded-lg ${!operacion.cuentaOrigen || !operacion.cuentaDestino
            ? "bg-gray-400"
            : "bg-yellow-400"
            }`}
        >
          <Text className="text-black font-bold">Siguiente</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
