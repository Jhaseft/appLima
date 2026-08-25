import { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Text, Image } from "react-native";
import FieldWrapper from "./FieldWrapper";
import SelectModal from "./SelectModal";
import { colors } from "../../theme/colors";
import { COUNTRIES, NATIONALITIES } from "./data/countries";

export default function Step2Extras({ data, setData, errors }) {
  const [showPhone, setShowPhone] = useState(false);
  const [showNationality, setShowNationality] = useState(false);
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (!data.phone) return;
    const country = COUNTRIES.find((c) => data.phone.startsWith(c.value));
    if (country) {
      setPhoneCode(country.value);
      setPhoneNumber(data.phone.slice(country.value.length));
    }
  }, [data.phone]);

  const updatePhone = (code, number) =>
    setData("phone", code && number ? code + number : "");

  const selectCode = (item) => {
    setPhoneCode(item.value);
    updatePhone(item.value, phoneNumber);
    setShowPhone(false);
  };

  const changeNumber = (n) => {
    const clean = n.replace(/\D/g, "");
    setPhoneNumber(clean);
    updatePhone(phoneCode, clean);
  };

  const selectedFlag = COUNTRIES.find((c) => c.value === phoneCode)?.flag;

  return (
    <View className="space-y-5">
      <FieldWrapper label="Número de teléfono *" error={errors.phone}>
        <View className="flex-row space-x-2 items-center">
          <TouchableOpacity
            className="flex-row items-center border border-gray-300 rounded-xl px-3 py-2"
            onPress={() => setShowPhone(true)}
          >
            {selectedFlag ? (
              <Image
                source={{ uri: selectedFlag }}
                className="w-6 h-4 mr-2 rounded border border-gray-200"
              />
            ) : null}
            <Text className="text-text font-sans">{phoneCode || "+---"}</Text>
          </TouchableOpacity>

          <TextInput
            value={phoneNumber}
            onChangeText={changeNumber}
            placeholder="76543210"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            className="flex-1 text-text font-sans px-2 py-2"
          />
        </View>
      </FieldWrapper>

      <FieldWrapper label="Nacionalidad *" error={errors.nationality}>
        <TouchableOpacity onPress={() => setShowNationality(true)}>
          <Text className="text-text font-sans py-1">
            {data.nationality || "Seleccione..."}
          </Text>
        </TouchableOpacity>
      </FieldWrapper>

      <FieldWrapper label="Documento *" error={errors.document_number}>
        <TextInput
          value={data.document_number || ""}
          onChangeText={(v) => setData("document_number", v.replace(/\D/g, ""))}
          placeholder="1234567"
          placeholderTextColor={colors.textMuted}
          keyboardType="numeric"
          className="text-text font-sans py-1"
        />
      </FieldWrapper>

      <SelectModal
        visible={showPhone}
        onClose={() => setShowPhone(false)}
        items={COUNTRIES}
        onSelect={selectCode}
      />
      <SelectModal
        visible={showNationality}
        onClose={() => setShowNationality(false)}
        items={NATIONALITIES}
        onSelect={(item) => {
          setData("nationality", item.value);
          setShowNationality(false);
        }}
      />
    </View>
  );
}
