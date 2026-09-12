import { View, Text, Switch } from "react-native";
import { colors } from "../../theme/colors";

export default function MenuToggleRow({ label, icon: Icon, value, onValueChange, disabled }) {
  return (
    <View className="flex-row items-center px-5 py-4 border-b border-border">
      <Icon size={22} color={colors.text} />
      <Text className="ml-4 flex-1 text-base font-lm-medium text-text">{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={colors.background}
        ios_backgroundColor={colors.border}
      />
    </View>
  );
}
