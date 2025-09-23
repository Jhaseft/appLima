
import { Text, ScrollView, ActivityIndicator, View } from "react-native";
import FooterLayout from "../FooterLayout/FooterLayout";
import HeaderUser from "../UserDropdown/HeaderUser";
import Botons from "../Home/Botons";
import { useUser } from "../ContextUser/UserContext";
import GraficoLineas from "./Grafico";
import Horarios from "./Horarios";

export default function Home() {
  const { user, loading } = useUser();

  return (
    <FooterLayout>
      <ScrollView
        className="flex-1 bg-white px-6"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <HeaderUser title="Transfer Cash" />

        <View className="my-7">
          {loading ? (
            <ActivityIndicator size="large" color="#6366F1" />
          ) : (
            <Text className="text-2xl font-bold text-black">
              Bienvenido(a) {user?.first_name || "Usuario"}
            </Text>
          )}
        </View>
        {/* 3 Botones de redireccion */}
        <Botons />
        {/* Grafico */}
        <GraficoLineas />
        <Horarios />

      </ScrollView>
    </FooterLayout>
  );
}
