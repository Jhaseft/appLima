import { Pressable, View, Text } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { colors } from "../../theme/colors";

export default function MenuRow({ label, icon: Icon, onPress, danger, trailing, svgIcon }) {
  const tint = danger ? colors.danger : colors.text;
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-5 py-4 border-b border-border"
    >
      {svgIcon ? <Icon width={22} height={22} /> : <Icon size={22} color={tint} />}
      <Text
        className={`ml-4 flex-1 text-base font-lm-medium ${
          danger ? "text-danger" : "text-text"
        }`}
      >
        {label}
      </Text>
      {trailing}
      <ChevronRight size={22} color={danger ? colors.danger : colors.textMuted} />
    </Pressable>
  );
}
