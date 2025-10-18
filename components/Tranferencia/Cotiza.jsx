import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RefreshCw } from "lucide-react-native";

export default function Cotiza({ onNext, operacion, setOperacion }) {
  const [monto, setMonto] = useState("");
  const [conversion, setConversion] = useState("");
  const [modo, setModo] = useState("PENtoBOB");
  const [error, setError] = useState("");
  const [tasas, setTasas] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carga y cacheo de tasas
  const loadTasas = async () => {
    try {
      setLoading(true);
      const cached = await AsyncStorage.getItem("ultimaTasa");
      const lastUpdate = await AsyncStorage.getItem("ultimaTasaUpdate");
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      if (cached && lastUpdate && now - parseInt(lastUpdate) < fiveMinutes) {
        setTasas(JSON.parse(cached));
      } else {
        const res = await fetch(
          "https://panel.transfercash.click/api/tipo-cambio/historial"
        );
        const json = await res.json();
        const ultima = json[json.length - 1];
        setTasas(ultima);

        await AsyncStorage.setItem("ultimaTasa", JSON.stringify(ultima));
        await AsyncStorage.setItem("ultimaTasaUpdate", now.toString());
      }
    } catch (err) {
      console.error("Error cargando tasas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasas();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#FACC15" />
        <Text className="text-gray-700 mt-2">Cargando tasas...</Text>
      </View>
    );
  }

  if (!tasas) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">No se pudo obtener la tasa.</Text>
      </View>
    );
  }

  const tasaCompra = parseFloat(tasas.compra);
  const tasaVenta = parseFloat(tasas.venta);

  const calcularConversion = (valor, tipo) => {
    if (tipo === "PENtoBOB") return (valor * tasaCompra).toFixed(2);
    return (valor / tasaVenta).toFixed(2);
  };

  // Manejo de cambios en el input permitiendo decimales
  const handleCambio = (valorStr) => {
    // Reemplaza comas por puntos
    let valorClean = valorStr.replace(",", ".");

    // Permite solo números y un punto
    if (/^[0-9]*\.?[0-9]*$/.test(valorClean)) {
      const valor = parseFloat(valorClean);

      if (!isNaN(valor) && valor >= 0) {
        setMonto(valorClean);
        setError("");
        setConversion(calcularConversion(valor, modo));
      } else if (valor < 0) {
        setMonto("");
        setConversion("");
        setError("⚠️ El monto no puede ser negativo.");
      } else {
        setMonto(valorClean); // permite que escriba mientras no sea inválido
        setConversion("");
      }
    }
  };

  const toggleModo = () => {
    const nuevoModo = modo === "BOBtoPEN" ? "PENtoBOB" : "BOBtoPEN";
    setModo(nuevoModo);

    const valor = parseFloat(monto.replace(",", "."));
    if (!isNaN(valor)) {
      setConversion(calcularConversion(valor, nuevoModo));
    }
  };

  const handleNext = () => {
    const valor = parseFloat(monto.replace(",", "."));
    const data = {
      monto: valor,
      conversion,
      modo,
      tasa: modo === "PENtoBOB" ? tasaCompra : tasaVenta,
    };

    setOperacion((prev) => ({
      ...prev,
      ...data,
    }));

    onNext();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-2xl font-bold text-black">TransferCash</Text>
        <Text className="text-sm text-gray-600 text-center mb-4">
          Cambio de divisas rápido, seguro y confiable
        </Text>

        <View className="flex-row justify-between w-full mb-4">
          <Text className="text-black font-semibold">
            COMPRA: <Text className="text-yellow-500">{tasaCompra.toFixed(2)}</Text>
          </Text>
          <Text className="text-black font-semibold">
            VENTA: <Text className="text-yellow-500">{tasaVenta.toFixed(2)}</Text>
          </Text>
        </View>

        <View className="w-full bg-white p-6 gap-3 rounded-xl border border-gray-200">
          <View>
            <Text className="text-sm font-medium text-gray-700 text-center mb-1">
              {modo === "BOBtoPEN" ? "TIENES BOLIVIANOS" : "TIENES SOLES"}
            </Text>
            <TextInput
              keyboardType="numeric"
              value={monto.toString()}
              onChangeText={handleCambio}
              placeholder="0.00"
              className="border border-gray-400 rounded-lg px-3 py-2 text-center font-semibold text-black"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="flex-row justify-center">
            <TouchableOpacity
              onPress={toggleModo}
              className="p-2 bg-yellow-400 rounded-full shadow"
            >
              <RefreshCw size={22} color="black" />
            </TouchableOpacity>
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 text-center mb-1">
              {modo === "BOBtoPEN" ? "RECIBES SOLES" : "RECIBES BOLIVIANOS"}
            </Text>
            <TextInput
              value={conversion.toString()}
              editable={false}
              className="border border-gray-400 rounded-lg px-3 py-2 text-center font-semibold bg-gray-50 text-black"
            />
          </View>

          {error ? (
            <Text className="text-red-500 text-sm text-center">{error}</Text>
          ) : null}

          <TouchableOpacity
            onPress={handleNext}
            className={`py-3 rounded-lg mt-2 shadow ${monto ? "bg-yellow-400" : "bg-gray-300"}`}
            disabled={!monto || parseFloat(monto.replace(",", ".")) <= 0}
          >
            <Text className="text-black font-bold text-center">
              Iniciar Operación
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
