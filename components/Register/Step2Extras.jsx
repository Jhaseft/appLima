import { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Text, Modal, FlatList, Image } from "react-native";
import FieldWrapper from "./FieldWrapper";

// Datos fijos
const countries = [
  { value: "+591", label: "Bolivia", flag: "https://res.cloudinary.com/dnbklbswg/image/upload/v1756307093/bo_cvvq8f.png" },
  { value: "+51", label: "Perú", flag: "https://res.cloudinary.com/dnbklbswg/image/upload/v1756307130/pe_wfge4z.png" },
  { value: "+54", label: "Argentina", flag: "https://res.cloudinary.com/dnbklbswg/image/upload/v1756307148/ar_gfxwtp.png" },
  { value: "+56", label: "Chile", flag: "https://res.cloudinary.com/dnbklbswg/image/upload/v1756307165/cl_pevfj1.png" },
  { value: "+57", label: "Colombia", flag: "https://res.cloudinary.com/dnbklbswg/image/upload/v1756307169/co_wpavku.png" },
  { value: "+58", label: "Venezuela", flag: "https://res.cloudinary.com/dnbklbswg/image/upload/v1756307176/ve_bnigse.png" },
];

const nationalities = [
  { value: "boliviano", label: "Boliviano" },
  { value: "peruano", label: "Peruano" },
];

export default function Step2Extras({ data, setData, errors }) {
  const [showPhonePicker, setShowPhonePicker] = useState(false);
  const [showNationalityPicker, setShowNationalityPicker] = useState(false);
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Inicializa phoneCode y phoneNumber desde data.phone
useEffect(() => {
  if (data.phone) {
    // Encuentra el país cuyo value coincide con el inicio del número
    const country = countries.find(c => data.phone.startsWith(c.value));
    if (country) {
      setPhoneCode(country.value);
      setPhoneNumber(data.phone.slice(country.value.length));
    }
  }
}, [data.phone]);

const updatePhone = (code, number) => {
  if (!code || !number) return setData("phone", "");
  setData("phone", code + number); // Guarda siempre con el +
};
  const handlePhoneCodeSelect = (code) => {
    setPhoneCode(code);
    updatePhone(code, phoneNumber);
    setShowPhonePicker(false);
  };

  const handlePhoneNumberChange = (number) => {
    const cleanNumber = number.replace(/\D/g, "");
    setPhoneNumber(cleanNumber);
    updatePhone(phoneCode, cleanNumber);
  };

  return (
    <View className="space-y-5">

      {/* Teléfono */}
      <FieldWrapper label="Número de teléfono *" error={errors.phone}>
        <View className="flex-row space-x-2 items-center">
          <TouchableOpacity
            className="flex-row items-center border border-gray-300 rounded-xl px-3 py-2"
            onPress={() => setShowPhonePicker(true)}
          >
            {phoneCode && <Image source={{ uri: countries.find(c => c.value === phoneCode)?.flag }} className="w-6 h-4 mr-2 rounded border" />}
            <Text>{phoneCode || "+---"}</Text>
          </TouchableOpacity>

          <TextInput
            value={phoneNumber}
            onChangeText={handlePhoneNumberChange}
            placeholder="76543210"
            placeholderTextColor="#888"
            keyboardType="numeric"
            className="flex-1 rounded-xl border border-gray-300 px-4 py-2 text-sm"
          />
        </View>

        <Modal visible={showPhonePicker} transparent animationType="fade">
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white w-3/4 max-h-80 rounded-xl overflow-hidden">
              <FlatList
                data={countries}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity className="flex-row items-center px-4 py-3" onPress={() => handlePhoneCodeSelect(item.value)}>
                    <Image source={{ uri: item.flag }} className="w-6 h-4 mr-2 rounded border" />
                    <Text>{item.label} ({item.value})</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity className="p-3 items-center border-t border-gray-200" onPress={() => setShowPhonePicker(false)}>
                <Text className="text-blue-500 font-semibold">Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </FieldWrapper>

      {/* Nacionalidad */}
      <FieldWrapper label="Nacionalidad *" error={errors.nationality}>
        <TouchableOpacity
          className="flex-row items-center border border-gray-300 rounded-xl px-4 py-2"
          onPress={() => setShowNationalityPicker(true)}
        >
          <Text>{data.nationality || "Seleccione..."}</Text>
        </TouchableOpacity>

        <Modal visible={showNationalityPicker} transparent animationType="fade">
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white w-3/4 max-h-80 rounded-xl overflow-hidden">
              <FlatList
                data={nationalities}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="px-4 py-3"
                    onPress={() => {
                      setData("nationality", item.value);
                      setShowNationalityPicker(false);
                    }}
                  >
                    <Text>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity className="p-3 items-center border-t border-gray-200" onPress={() => setShowNationalityPicker(false)}>
                <Text className="text-blue-500 font-semibold">Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </FieldWrapper>

      {/* Documento */}
      <FieldWrapper label="Documento *" error={errors.document_number}>
        <TextInput
          value={data.document_number || ""}
          onChangeText={(v) => setData("document_number", v.replace(/\D/g, ""))}
          placeholder="1234567"
          keyboardType="numeric"
          className="rounded-xl border border-gray-300 px-4 py-2 text-sm"
        />
      </FieldWrapper>
    </View>
  );
}
