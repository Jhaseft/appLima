import { View, TextInput } from "react-native";
import FieldWrapper from "./FieldWrapper";

export default function Step1Personal({ data, setData, errors }) {
  const handleChange = (field, value) => {
    setData(field, value); // Guardar el valor directamente
  };

  const fields = [
    { label: "Nombre *", key: "first_name" },
    { label: "Apellido *", key: "last_name" },
    { label: "Correo electrónico *", key: "email", keyboard: "email-address" },
  ];

  return (
    <View className="space-y-3">
      {fields.map(f => (
        <FieldWrapper key={f.key} label={f.label} error={errors[f.key]}>
          <TextInput
            value={data[f.key]}
            onChangeText={(v) => handleChange(f.key, v)}
            keyboardType={f.keyboard || "default"}
            placeholder={f.label}
            placeholderTextColor="#888"
            autoCapitalize={f.key !== "email" ? "words" : "none"}
            maxLength={f.key === "email" ? 50 : 30} // límite visual
            className="h-11 px-3 border border-gray-300 rounded-xl text-base bg-white"
            clearButtonMode="while-editing"
          />
        </FieldWrapper>
      ))}
    </View>
  );
}
