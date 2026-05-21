import { View, Text, ScrollView } from "react-native";
import HeaderUser from "../UserDropdown/HeaderUser";
import { useUser } from "../ContextUser/UserContext";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  MapPin,
  Calendar,
  ShieldCheck,
} from "lucide-react-native";

function InfoRow({ icon: Icon, label, value }) {
  return (
    <View className="flex-row items-center py-4 border-b border-gray-100">
      <View className="w-9 h-9 rounded-full bg-yellow-100 items-center justify-center mr-4">
        <Icon size={18} color="#CA8A04" />
      </View>
      <View className="flex-1">
        <Text className="text-gray-400 text-xs mb-0.5">{label}</Text>
        <Text className="text-black text-sm font-semibold">
          {value || "—"}
        </Text>
      </View>
    </View>
  );
}

function Section({ title, children }) {
  return (
    <View className="mb-5">
      <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 px-1">
        {title}
      </Text>
      <View className="bg-white rounded-2xl border border-gray-200 px-4">
        {children}
      </View>
    </View>
  );
}

export default function MiCuenta() {
  const { user } = useUser();

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <HeaderUser title="Mi cuenta" />

      {/* Avatar + nombre */}
      <View className="items-center mb-6 mt-2">
        <View className="w-20 h-20 rounded-full bg-yellow-400 items-center justify-center border-2 border-black mb-3">
          <Text className="text-black text-3xl font-bold">
            {user
              ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase()
              : "?"}
          </Text>
        </View>
        <Text className="text-black text-xl font-bold">
          {user ? `${user.first_name} ${user.last_name}` : "—"}
        </Text>

      </View>

      <Section title="Información personal">
        <InfoRow icon={User} label="Nombre completo" value={user ? `${user.first_name} ${user.last_name}` : null} />
        <InfoRow icon={Mail} label="Correo electrónico" value={user?.email} />
        <InfoRow icon={Phone} label="Teléfono" value={user?.phone} />
      </Section>

      <Section title="Documento de identidad">
        <InfoRow icon={CreditCard} label="Número de documento" value={user?.document_number} />
      </Section>


    </ScrollView>
  );
}
