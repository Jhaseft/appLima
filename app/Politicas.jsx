import { Text, ScrollView } from "react-native";
import HeaderUser from "../components/UserDropdown/HeaderUser";
import SeccionPolitica from "../components/Politicas/SeccionPolitica";
import { SECCIONES } from "../components/Politicas/data/secciones";

export default function PoliticasPage() {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <HeaderUser title="Politicas" subtitle="Cuentas y Billeteras - Transfer Cash" />
      <Text className="text-text-muted text-sm mb-6">Última actualización: enero 2025</Text>

      {SECCIONES.map((sec, i) => (
        <SeccionPolitica key={i} titulo={sec.titulo} contenido={sec.contenido} />
      ))}
    </ScrollView>
  );
}
