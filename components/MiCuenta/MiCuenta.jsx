import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeaderUser from "../UserDropdown/HeaderUser";
import { useUser } from "../ContextUser/UserContext";
import API_BASE_URL from "../api";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Globe,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
} from "lucide-react-native";

const KYC_DEEP_LINK = process.env.EXPO_PUBLIC_KYC_DEEP_LINK;

function InfoRow({ icon: Icon, label, value, rightElement }) {
  return (
    <View className="flex-row items-center py-4 border-b border-gray-100">
      <View className="w-9 h-9 rounded-full bg-yellow-100 items-center justify-center mr-4">
        <Icon size={18} color="#CA8A04" />
      </View>
      <View className="flex-1">
        <Text className="text-gray-400 text-xs mb-0.5">{label}</Text>
        <Text className="text-black text-sm font-semibold">{value || "—"}</Text>
      </View>
      {rightElement}
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
  const [token, setToken] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("token").then(setToken);
  }, []);

  const isVerified = user?.kyc_status === "verified";

  const openKycInBrowser = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/kyc/session`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ next_url: KYC_DEEP_LINK }),
      });
      const data = await response.json();
      if (!data.redirect_url) throw new Error("No se recibió redirect_url");
      await Linking.openURL(data.redirect_url);
    } catch (err) {
      console.error("Error KYC:", err);
      Alert.alert("Error", "Hubo un problema al iniciar la verificación KYC.");
    }
  };

  const kycLabel = isVerified ? "Verificado" : (user?.kyc_status ?? "Sin verificar");

  const kycButton = !isVerified ? (
    <TouchableOpacity
      onPress={openKycInBrowser}
      className="flex-row items-center bg-yellow-400 px-3 py-1.5 rounded-lg gap-1"
    >
      <ExternalLink size={13} color="black" />
      <Text className="text-black text-xs font-bold">Hacer KYC</Text>
    </TouchableOpacity>
  ) : null;

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <HeaderUser title="Mi cuenta" />

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

        {/* KYC badge bajo el nombre */}
        <View
          className={`flex-row items-center mt-2 px-3 py-1 rounded-full gap-1 ${
            isVerified ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {isVerified ? (
            <ShieldCheck size={14} color="#16A34A" />
          ) : (
            <ShieldAlert size={14} color="#DC2626" />
          )}
          <Text
            className={`text-xs font-semibold ${
              isVerified ? "text-green-700" : "text-red-600"
            }`}
          >
            KYC: {kycLabel}
          </Text>
        </View>

        {/* Botón de KYC si no está verificado */}
        {!isVerified && (
          <TouchableOpacity
            onPress={openKycInBrowser}
            className="flex-row items-center bg-yellow-400 mt-3 px-5 py-2.5 rounded-xl gap-2 shadow"
          >
            <ExternalLink size={16} color="black" />
            <Text className="text-black font-bold text-sm">Verificar mi identidad (KYC)</Text>
          </TouchableOpacity>
        )}
      </View>

      <Section title="Información personal">
        <InfoRow
          icon={User}
          label="Nombre completo"
          value={user ? `${user.first_name} ${user.last_name}` : null}
        />
        <InfoRow icon={Mail} label="Correo electrónico" value={user?.email} />
        <InfoRow icon={Phone} label="Teléfono" value={user?.phone} />
        <InfoRow icon={Globe} label="Nacionalidad" value={user?.nationality} />
      </Section>

      <Section title="Documento de identidad">
        <InfoRow
          icon={CreditCard}
          label="Número de documento"
          value={user?.document_number}
        />
      </Section>

      <Section title="Verificación de identidad">
        <InfoRow
          icon={isVerified ? ShieldCheck : ShieldAlert}
          label="Estado KYC"
          value={kycLabel}
          rightElement={kycButton}
        />
      </Section>
    </ScrollView>
  );
}
