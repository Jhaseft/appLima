import { TouchableOpacity, Text } from "react-native";
import { ExternalLink } from "lucide-react-native";
import { colors } from "../../theme/colors";

export default function KycButton({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center bg-primary px-3 py-1.5 rounded-lg gap-1"
    >
      <ExternalLink size={13} color={colors.text} />
      <Text className="text-text text-xs font-lm-bold">Hacer KYC</Text>
    </TouchableOpacity>
  );
}
