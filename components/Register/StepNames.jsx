import { View, TextInput } from "react-native";
import FieldWrapper from "./FieldWrapper";
import { colors } from "../../theme/colors";

export default function StepNames({ data, setData, errors }) {
  return (
    <View className="space-y-3">
      <FieldWrapper label="Nombre *" error={errors.first_name}>
        <TextInput
          value={data.first_name}
          onChangeText={(v) => setData("first_name", v)}
          placeholder="Nombre"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="words"
          maxLength={30}
          className="h-11 text-base text-text font-sans"
        />
      </FieldWrapper>

      <FieldWrapper label="Apellido *" error={errors.last_name}>
        <TextInput
          value={data.last_name}
          onChangeText={(v) => setData("last_name", v)}
          placeholder="Apellido"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="words"
          maxLength={30}
          className="h-11 text-base text-text font-sans"
        />
      </FieldWrapper>
    </View>
  );
}
