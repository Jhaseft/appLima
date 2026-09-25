import { View, Text, TouchableOpacity } from "react-native";
import { ShieldCheck, ShieldAlert, ExternalLink } from "lucide-react-native";
import { colors } from "../../theme/colors";

export default function ProfileSummary({ iniciales, nombre, isVerified, onKyc }) {
  return (
    <View className="bg-background rounded-3xl border border-border p-5 mb-6 mt-2">
      <View className="flex-row items-center">
        <View className="w-16 h-16 rounded-full bg-primary items-center justify-center border-2 border-primary-accent">
          <Text className="text-text text-2xl font-lm-bold">{iniciales}</Text>
        </View>

        <View className="flex-1 ml-4">
          <Text className="text-text text-lg font-lm-bold" numberOfLines={2}>
            {nombre}
          </Text>

          <View
            className={`flex-row items-center self-start mt-1.5 px-2.5 py-1 rounded-full gap-1 ${
              isVerified ? "bg-success" : "bg-danger"
            }`}
          >
            {isVerified ? (
              <ShieldCheck size={13} color={colors.background} />
            ) : (
              <ShieldAlert size={13} color={colors.background} />
            )}
            <Text className="text-white text-[11px] font-lm-bold">
              {isVerified ? "Verificado" : "Sin verificar"}
            </Text>
          </View>
        </View>
      </View>

      {!isVerified && (
        <TouchableOpacity
          onPress={onKyc}
          className="flex-row items-center justify-center bg-primary mt-5 px-5 py-3 rounded-2xl gap-2"
        >
          <ExternalLink size={16} color={colors.text} />
          <Text className="text-text font-lm-bold text-sm">Verificar mi identidad</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
