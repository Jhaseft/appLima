import { Text, View, ScrollView } from "react-native";
import FooterLayout from "../FooterLayout/FooterLayout";
import HeaderUser from "../UserDropdown/HeaderUser";

export default function Cuentas() {
  return (
    <FooterLayout>
      <ScrollView className="flex-1 bg-white px-6" contentContainerStyle={{ paddingBottom: 40 }}>
        <HeaderUser title="Cuentas Bancarias" />

        <View className="flex-1 bg-white justify-center items-center my-6">
          <Text>Lista de cuentas o información del usuario</Text>
        </View>
      </ScrollView>
    </FooterLayout>
  );
}
