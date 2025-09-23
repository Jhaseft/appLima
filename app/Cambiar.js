
import { Text, View, ScrollView } from "react-native";
import FooterLayout from "../components/FooterLayout/FooterLayout";
import HeaderUser from "../components/UserDropdown/HeaderUser";
import { useUser } from "../components/ContextUser/UserContext";

export default function Cambiar() {
  const { user } = useUser(); // obtenemos el usuario del contexto

  return (
    <FooterLayout>
      <ScrollView className="flex-1 bg-white px-6" contentContainerStyle={{ paddingBottom: 40 }}>
        <HeaderUser title="Cambiar" />

        <View className="flex-1 bg-white justify-center items-center">
          <Text className="text-xl my-6">
            Hola, {user?.first_name || "Usuario"} 👋
          </Text>
          {/* Aquí puedes agregar más contenido de la página Cambiar */}
        </View>
      </ScrollView>
    </FooterLayout>
  );
}
