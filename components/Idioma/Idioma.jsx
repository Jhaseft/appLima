import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { colors } from "../../theme/colors";
import HeaderUser from "../UserDropdown/HeaderUser";
import { IDIOMAS } from "./data/idiomas";

export default function Idioma() {
  const avisar = () =>
    Alert.alert("Muy pronto", "TransferCash estará disponible en varios idiomas.");

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <HeaderUser title="Idioma" subtitle="Elige el idioma de la app" />

      <Text className="px-5 pt-4 pb-2 text-text-muted text-sm font-lm-medium">
        Selecciona el idioma de la aplicación.
      </Text>

      {IDIOMAS.map((idioma) => (
        <Pressable
          key={idioma.code}
          onPress={avisar}
          className="flex-row items-center px-5 py-4 border-b border-border"
        >
          <Text className="text-2xl mr-4">{idioma.flag}</Text>
          <Text className="flex-1 text-base font-lm-medium text-text">{idioma.label}</Text>
          <View className="bg-primary-light rounded-full px-3 py-1 mr-2">
            <Text className="text-primary-dark text-xs font-lm-bold">Muy pronto</Text>
          </View>
          <ChevronRight size={20} color={colors.textMuted} />
        </Pressable>
      ))}
    </ScrollView>
  );
}
