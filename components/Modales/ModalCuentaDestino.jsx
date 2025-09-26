import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Animated,
  Easing,
  Linking,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import BankSelect from "./BankSelect";
import AsyncStorage from "@react-native-async-storage/async-storage";

let bancosCache = null;

export default function ModalCuentaDestino({
  bancos: bancosProp,
  isOpen,
  onClose,
  user,
  onCuentaGuardada,
}) {
  const [banco, setBanco] = useState(null);
  const [nombrePropietario, setNombrePropietario] = useState("");
  const [dniPropietario, setDniPropietario] = useState("");
  const [contacto, setContacto] = useState("");
  const [numeroCuenta, setNumeroCuenta] = useState("");
  const [juramento, setJuramento] = useState(false);
  const [terminos, setTerminos] = useState(false);
  const [bancosDisponibles, setBancosDisponibles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [animJuramento] = useState(new Animated.Value(0));
  const [animTerminos] = useState(new Animated.Value(0));

  // Cargar bancos al abrir
  useEffect(() => {
    if (!isOpen) return;

    const fetchBancos = async () => {
      try {
        let data = bancosCache || bancosProp;
        if (!data || data.length === 0) {
          const res = await fetch("https://panel.transfercash.click/operacion/listar-bancos");
          if (!res.ok) return;
          data = await res.json();
        }
        bancosCache = data;
        setBancosDisponibles(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBancos();

    // Reset form al abrir
    setBanco(null);
    setNombrePropietario("");
    setDniPropietario("");
    setContacto("");
    setNumeroCuenta("");
    setJuramento(false);
    setTerminos(false);
    animJuramento.setValue(0);
    animTerminos.setValue(0);
  }, [isOpen, bancosProp]);

  const toggleSwitch = (type) => {
    const anim = type === "juramento" ? animJuramento : animTerminos;
    const setter = type === "juramento" ? setJuramento : setTerminos;
    setter((prev) => !prev);
    Animated.timing(anim, {
      toValue: type === "juramento" ? !juramento ? 1 : 0 : !terminos ? 1 : 0,
      duration: 250,
      easing: Easing.out(Easing.circle),
      useNativeDriver: false,
    }).start();
  };

  const handleSave = async () => {
    if (!(juramento && terminos && banco && numeroCuenta && nombrePropietario && dniPropietario && contacto))
      return;

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");

      // Guardar cuenta en backend
      const res = await fetch("https://panel.transfercash.click/api/operacion/guardar-cuenta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          bank_id: banco.id,
          account_number: numeroCuenta,
          account_type: "destination",
          owner_full_name: nombrePropietario,
          owner_document: dniPropietario,
          owner_phone: contacto,
        }),
      });

      const text = await res.text();
      const data = JSON.parse(text);
      if (!res.ok) throw new Error(data.message || "Error en el servidor");

      // Al final de handleSave, después de guarsadar en backend:
      const cuentasRes = await fetch(`https://panel.transfercash.click/api/listar-cuentas?user_id=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const cuentasData = await cuentasRes.json();

      // Asociamos banco completo a cada cuenta
      const cuentasConBanco = cuentasData.map(c => ({
        ...c,
        bank: bancosCache.find(b => b.id === c.bank_id) || null,
      }));

      await AsyncStorage.setItem("cuentasUsuario", JSON.stringify(cuentasConBanco));
      await AsyncStorage.setItem("cuentasUsuario_lastFetch", Date.now().toString());

      // Devuelve al padre la lista completa
      onCuentaGuardada?.(cuentasConBanco);

      Alert.alert("Éxito", "Cuenta guardada correctamente");
      onClose();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Error al guardar cuenta: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const cuentaPlaceholder =
    banco && ["yape", "plin"].includes(banco.name?.toLowerCase())
      ? "Número de teléfono"
      : "Número de cuenta";

  const cuentaType =
    banco && ["yape", "plin"].includes(banco.name?.toLowerCase())
      ? "phone-pad"
      : "number-pad";

  const renderSwitch = (animatedValue) => {
    const translateX = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [2, 22] });
    const backgroundColor = animatedValue.interpolate({ inputRange: [0, 1], outputRange: ["#e5e7eb", "#3b82f6"] });
    return (
      <Animated.View className="w-11 h-6 rounded-full p-1 justify-center" style={{ backgroundColor }}>
        <Animated.View className="w-5 h-5 rounded-full bg-white shadow" style={{ transform: [{ translateX }] }} />
      </Animated.View>
    );
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        className="flex-1 justify-center items-center bg-black/50 px-4"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {loading && (
          <View className="absolute inset-0 flex justify-center items-center bg-black/60 z-50">
            <ActivityIndicator size="large" color="white" />
            <Text className="text-white mt-3 text-lg">Guardando cuenta...</Text>
          </View>
        )}

        <ScrollView
          contentContainerStyle={{ width: "100%", alignItems: "center" }}
          className="bg-white py-10 px-3 rounded-3xl shadow-xl max-w-md mt-40 mb-52"
        >
          <Text className="text-2xl font-bold mb-6 text-center text-gray-800">Registrar nueva cuenta destino</Text>

          <BankSelect options={bancosDisponibles} value={banco} onChange={setBanco} loading={bancosDisponibles.length === 0} />

          <View className="border p-3 rounded-lg w-full">
            <Text className="text-sm font-semibold mb-2">Datos del propietario</Text>
            <TextInput placeholder="Nombre completo" placeholderTextColor="#9ca3af" value={nombrePropietario} onChangeText={setNombrePropietario} className="border rounded-lg p-2 mb-2 w-full" />
            <TextInput placeholder="CI o DNI" placeholderTextColor="#9ca3af" value={dniPropietario} onChangeText={setDniPropietario} keyboardType="number-pad" className="border rounded-lg p-2 mb-2 w-full" />
            <TextInput placeholder="Número de contacto" placeholderTextColor="#9ca3af" value={contacto} onChangeText={setContacto} keyboardType="phone-pad" className="border rounded-lg p-2 w-full" />
          </View>

          <TextInput
            className="border border-gray-300 rounded-2xl p-4 my-4 text-base bg-gray-50 w-full"
            placeholder={cuentaPlaceholder || "Número de cuenta"}
            placeholderTextColor="#9ca3af"
            keyboardType={cuentaType}
            value={numeroCuenta}
            onChangeText={setNumeroCuenta}
          />

          <View className="mb-6 space-y-3">
            <TouchableOpacity onPress={() => toggleSwitch("juramento")} className="flex-row items-start gap-3">
              {renderSwitch(animJuramento)}
              <Text className="text-gray-700 text-sm flex-shrink">
                Declaro bajo juramento que soy responsable{"\n"}de la cuenta registrada.
              </Text>
            </TouchableOpacity>


            <TouchableOpacity onPress={() => toggleSwitch("terminos")} className="flex-row items-start gap-3">
              {renderSwitch(animTerminos)}
              <Text className="text-gray-700 text-sm flex-shrink">
                Acepto los{" "}
                <Text className="text-blue-600 underline" onPress={() => Linking.openURL("https://panel.transfercash.click/politicas")}>
                  Términos y Política de privacidad
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-end space-x-3 mt-5 w-full">
            <TouchableOpacity className="bg-red-600 px-6 py-3 rounded-2xl shadow-md" onPress={onClose}>
              <Text className="text-white font-semibold text-base text-center">Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-6 py-3 rounded-2xl shadow-md ${juramento && terminos && banco && numeroCuenta && nombrePropietario && dniPropietario && contacto ? "bg-blue-600" : "bg-blue-400"}`}
              onPress={handleSave}
              disabled={!(juramento && terminos && banco && numeroCuenta && nombrePropietario && dniPropietario && contacto)}
            >
              <Text className="text-white font-semibold text-base text-center">Guardar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
