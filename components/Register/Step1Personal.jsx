import { View, TextInput, Text } from "react-native";
import FieldWrapper from "./FieldWrapper";

export default function Step1Personal({ data, setData, errors }) {
  const handleChange = (field, value) => {
    if (field === "first_name" || field === "last_name") {
      value = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
    }
    setData(field, value);
  };

  const fields = [
    { label: "Nombre *", key: "first_name" },
    { label: "Apellido *", key: "last_name" },
    { label: "Correo electrónico *", key: "email", keyboard: "email-address" },
  ];

  return (
    <View className="space-y-5">
      {fields.map(f => (
        <FieldWrapper key={f.key} label={f.label} error={errors[f.key]}>
          <TextInput
            value={data[f.key]}
            onChangeText={(v) => handleChange(f.key, v)}
            keyboardType={f.keyboard || "default"}
            className=" rounded-xl border border-gray-300 px-4 py-2 text-sm pl-3"
          />
        </FieldWrapper>
      ))}
    </View>
  );
}
