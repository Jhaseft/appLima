import { Text, ScrollView } from "react-native";
import HeaderUser from "../components/UserDropdown/HeaderUser";
import FaqItem from "../components/PreguntasFrecuentes/FaqItem";
import { PREGUNTAS } from "../components/PreguntasFrecuentes/data/preguntas";
import { HORARIOS_TEXTO } from "../components/api";

export default function PreguntasFrecuentesPage() {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <HeaderUser title="Preguntas Frecuentes" subtitle="Respuestas a las preguntas más comunes" />
      <Text className="text-text-muted text-sm mb-6">Toca una pregunta para ver la respuesta</Text>

      {PREGUNTAS(HORARIOS_TEXTO).map((item, i) => (
        <FaqItem key={i} item={item} />
      ))}
    </ScrollView>
  );
}
