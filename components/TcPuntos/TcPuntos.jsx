import { View, Text } from "react-native";
import { Coins } from "lucide-react-native";
import FooterLayout from "../FooterLayout/FooterLayout";
import HeaderUser from "../UserDropdown/HeaderUser";

export default function TcPuntos() {
  return (
    <FooterLayout>
      <HeaderUser title="TC Puntos" subtitle="Programa de recompensas" />

      <View className="flex-1 items-center justify-center bg-white px-8">
        <View className="w-24 h-24 rounded-full bg-yellow-400 items-center justify-center mb-6">
          <Coins size={48} color="black" />
        </View>

        <Text className="text-3xl font-bold text-black mb-3 text-center">
          Próximamente
        </Text>

        <Text className="text-gray-500 text-base text-center leading-6">
          Estamos trabajando en nuestro programa de puntos. Muy pronto podrás
          acumular y canjear recompensas con cada transferencia.
        </Text>
      </View>
    </FooterLayout>
  );
}
