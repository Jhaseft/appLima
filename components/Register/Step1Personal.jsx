import { View, TextInput } from "react-native";
import FieldWrapper from "./FieldWrapper";
import { colors } from "../../theme/colors";

const FIELDS = [
  { label: "Nombre *", key: "first_name" },
  { label: "Apellido *", key: "last_name" },
  { label: "Correo electrónico *", key: "email", keyboard: "email-address" },
];

export default function Step1Personal({ data, setData, errors }) {
  return (
    <View className="space-y-3">
      {FIELDS.map((f) => (
        <FieldWrapper key={f.key} label={f.label} error={errors[f.key]}>
          <TextInput
            value={data[f.key]}
            onChangeText={(v) => setData(f.key, v)}
            keyboardType={f.keyboard || "default"}
            placeholder={f.label}
            placeholderTextColor={colors.textMuted}
            autoCapitalize={f.key !== "email" ? "words" : "none"}
            maxLength={f.key === "email" ? 50 : 30}
            className="h-11 text-base text-text font-sans"
            clearButtonMode="while-editing"
          />
        </FieldWrapper>
      ))}
    </View>
  );
}
