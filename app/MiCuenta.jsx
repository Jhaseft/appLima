import { ScrollView } from "react-native";
import { User, Mail, Phone, CreditCard, Globe, ShieldCheck, ShieldAlert } from "lucide-react-native";
import HeaderUser from "../components/UserDropdown/HeaderUser";
import { useMiCuenta } from "../components/MiCuenta/hooks/useMiCuenta";
import ProfileSummary from "../components/MiCuenta/ProfileSummary";
import Section from "../components/MiCuenta/Section";
import InfoRow from "../components/MiCuenta/InfoRow";
import KycButton from "../components/MiCuenta/KycButton";

export default function MiCuentaPage() {
  const { user, isVerified, kycLabel, iniciales, nombre, iniciarKyc } = useMiCuenta();

  return (
    <ScrollView
      className="flex-1 bg-surface"
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <HeaderUser title="Mi cuenta" />

      <ProfileSummary
        iniciales={iniciales}
        nombre={nombre}
        isVerified={isVerified}
        onKyc={iniciarKyc}
      />

      <Section title="Información personal">
        <InfoRow icon={User} label="Nombre completo" value={user ? nombre : null} />
        <InfoRow icon={Mail} label="Correo electrónico" value={user?.email} />
        <InfoRow icon={Phone} label="Teléfono" value={user?.phone} />
        <InfoRow icon={Globe} label="Nacionalidad" value={user?.nationality} />
      </Section>

      <Section title="Documento de identidad">
        <InfoRow icon={CreditCard} label="Número de documento" value={user?.document_number} />
      </Section>

      <Section title="Verificación de identidad">
        <InfoRow
          icon={isVerified ? ShieldCheck : ShieldAlert}
          label="Estado KYC"
          value={kycLabel}
          rightElement={isVerified ? null : <KycButton onPress={iniciarKyc} />}
        />
      </Section>
    </ScrollView>
  );
}
