import { View, Text } from "react-native";

function Campo({ label, value }) {
  return (
    <View className="w-1/2 mb-3">
      <Text className="text-text-muted text-sm">{label}</Text>
      <Text className="text-text font-lm-medium">{value}</Text>
    </View>
  );
}

export default function UsuarioInfoCard({ user }) {
  return (
    <View className="bg-surface border border-border p-5 rounded-2xl mb-6">
      <Text className="font-lm-bold text-center text-lg mb-4 text-text">
        Información del Usuario
      </Text>
      <View className="flex-row flex-wrap">
        <Campo label="Nombre" value={`${user?.first_name || "N/A"} ${user?.last_name || ""}`} />
        <Campo label="CI" value={user?.document_number || "N/A"} />
        <Campo label="Nacionalidad" value={user?.nationality || "N/A"} />
        <Campo label="KYC" value={user?.kyc_status || "Pendiente"} />
      </View>
    </View>
  );
}
