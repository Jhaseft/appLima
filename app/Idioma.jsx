import { Text, ScrollView } from "react-native";
import HeaderUser from "../components/UserDropdown/HeaderUser";
import { useFeedback } from "../components/Feedback/FeedbackContext";
import IdiomaItem from "../components/Idioma/IdiomaItem";
import { IDIOMAS } from "../components/Idioma/data/idiomas";

export default function IdiomaPage() {
  const feedback = useFeedback();
  const avisar = () =>
    feedback.info("TransferCash estará disponible en varios idiomas.", { title: "Muy pronto" });

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
        <IdiomaItem key={idioma.code} idioma={idioma} onPress={avisar} />
      ))}
    </ScrollView>
  );
}
