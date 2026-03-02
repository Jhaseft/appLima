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
import API_BASE_URL from "../api";
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
          const res = await fetch(`${API_BASE_URL}/operacion/listar-bancos`);
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
      const res = await fetch(`${API_BASE_URL}/api/operacion/guardar-cuenta`, {
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
      const cuentasRes = await fetch(`${API_BASE_URL}/api/listar-cuentas?user_id=${user.id}`, {
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

  const canSave = juramento && terminos && banco && numeroCuenta && nombrePropietario && dniPropietario && contacto;
  const inputStyle = "border border-gray-200 rounded-xl p-4 text-base bg-gray-50 w-full";

  return (
    <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        className="flex-1 justify-end bg-black/50"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {loading && (
          <View className="absolute inset-0 justify-center items-center bg-black/60 z-50">
            <ActivityIndicator size="large" color="white" />
            <Text className="text-white mt-3 text-base font-medium">Guardando cuenta...</Text>
          </View>
        )}

        <ScrollView
          contentContainerStyle={{ alignItems: "center", paddingHorizontal: 24, paddingBottom: 36 }}
          className="bg-white rounded-t-3xl max-h-[92%]"
        >
          <View className="w-10 h-1 bg-gray-300 rounded-full mt-4 mb-6" />

          <Text className="text-xl font-bold text-gray-900 mb-1">Registrar cuenta destino</Text>
          <Text className="text-sm text-gray-400 mb-6">Cuenta de un tercero</Text>

          <View className="w-full">
            <BankSelect options={bancosDisponibles} value={banco} onChange={setBanco} loading={bancosDisponibles.length === 0} />
          </View>

          <View className="w-full mt-4 mb-1 bg-gray-50 border border-gray-200 rounded-2xl p-4 gap-3">
            <Text className="text-xs font-semibold text-gray-400 uppercase">Datos del propietario</Text>
            <TextInput className={inputStyle} placeholder="Nombre completo" placeholderTextColor="#9ca3af" value={nombrePropietario} onChangeText={setNombrePropietario} />
            <TextInput className={inputStyle} placeholder="CI o DNI" placeholderTextColor="#9ca3af" value={dniPropietario} onChangeText={setDniPropietario} keyboardType="number-pad" />
            <TextInput className={inputStyle} placeholder="Número de contacto" placeholderTextColor="#9ca3af" value={contacto} onChangeText={setContacto} keyboardType="phone-pad" />
          </View>

          <TextInput
            className={`${inputStyle} my-4`}
            placeholder={cuentaPlaceholder || "Número de cuenta"}
            placeholderTextColor="#9ca3af"
            keyboardType={cuentaType}
            value={numeroCuenta}
            onChangeText={setNumeroCuenta}
          />

          <View className="mb-7 w-full gap-4">
            <TouchableOpacity onPress={() => toggleSwitch("juramento")} className="flex-row items-center gap-3">
              {renderSwitch(animJuramento)}
              <Text className="text-gray-600 text-sm flex-1">
                Declaro bajo juramento que soy responsable de la cuenta registrada.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => toggleSwitch("terminos")} className="flex-row items-center gap-3">
              {renderSwitch(animTerminos)}
              <Text className="text-gray-600 text-sm flex-1">
                Acepto los{" "}
                <Text className="text-blue-600 underline" onPress={() => Linking.openURL(`${API_BASE_URL}/politicas`)}>
                  Términos y Política de privacidad
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-3 w-full">
            <TouchableOpacity className="flex-1 border border-gray-200 py-3.5 rounded-2xl" onPress={onClose}>
              <Text className="text-gray-700 font-semibold text-base text-center">Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3.5 rounded-2xl ${canSave ? "bg-blue-600" : "bg-blue-300"}`}
              onPress={handleSave}
              disabled={!canSave}
            >
              <Text className="text-white font-semibold text-base text-center">Guardar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
