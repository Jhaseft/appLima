import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import { MapPin, ExternalLink } from "lucide-react-native";
import { colors } from "../../theme/colors";

export default function OficinaCard({ oficina }) {
  return (
    <View className="gap-2">
      <Image source={{ uri: oficina.imagenLugar }} className="w-full h-36 rounded-xl" resizeMode="cover" />
      <Image source={{ uri: oficina.imagenMapa }} className="w-full h-36 rounded-xl mt-1" resizeMode="cover" />
      <View className="mt-1">
        <View className="flex-row items-center gap-1">
          <MapPin size={14} color={colors.primary} />
          <Text className="text-primary font-lm-medium text-sm">{oficina.nombre}</Text>
        </View>
        <Text className="text-background/70 text-xs mt-0.5">{oficina.direccion}</Text>
        <Text className="text-background/60 text-xs">{oficina.horario}</Text>
        <TouchableOpacity
          onPress={() => Linking.openURL(oficina.linkMapa)}
          className="mt-2 bg-primary py-2 rounded-xl flex-row justify-center items-center gap-2"
        >
          <ExternalLink size={14} color={colors.text} />
          <Text className="text-text font-lm-bold text-sm">Ver en Google Maps</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
