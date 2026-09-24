import { View, Text } from "react-native";

function Campo({ label, value, full }) {
  return (
    <View className={`${full ? "w-full" : "w-1/2"} mb-2`}>
      <Text className="text-text-muted text-sm">{label}</Text>
      <Text className="text-text">{value || "N/A"}</Text>
    </View>
  );
}

export default function DestinatarioInfo({ cuenta }) {
  return (
    <View className="mt-5 bg-surface border border-border p-4 rounded-xl">
      <Text className="font-lm-bold text-text text-base text-center mb-2">
        Información del Destinatario
      </Text>
      <View className="flex-row flex-wrap">
        <Campo label="Nombre" value={cuenta.owner_full_name} />
        <Campo label="Documento" value={cuenta.owner_document} />
        <Campo label="Teléfono" value={cuenta.owner_phone} />
      </View>
    </View>
  );
}
