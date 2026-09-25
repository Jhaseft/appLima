import { View, Text, TouchableOpacity, Image, Linking } from "react-native";
import { Banknote, QrCode, MapPin, ExternalLink, CreditCard } from "lucide-react-native";
import { colors } from "../../theme/colors";
import Bone from "../Home/Bone";
import { OFICINAS } from "./data/oficinas";

function MetodoBtn({ activo, onPress, Icon, label }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-lg border ${
        activo ? "bg-primary border-primary" : "bg-background border-border"
      }`}
    >
      <Icon size={16} color={colors.text} />
      <Text className="font-lm-medium text-text">{label}</Text>
    </TouchableOpacity>
  );
}

export default function SeccionNoBanco({ label, modo, nonBankMethod, setNonBankMethod, qrUserAccount, loadingQrUser, onAgregarQR }) {
  return (
    <View className="mb-4">
      <Text className="text-text font-lm-medium mb-2">{label}</Text>

      <View className="flex-row gap-2 mb-3">
        <MetodoBtn activo={nonBankMethod === "cash"} onPress={() => setNonBankMethod("cash")} Icon={Banknote} label="Efectivo" />
        <MetodoBtn activo={nonBankMethod === "qr"} onPress={() => setNonBankMethod("qr")} Icon={QrCode} label="QR" />
      </View>

      {nonBankMethod === "cash" && (
        <View className="border border-border rounded-lg bg-surface p-3">
          {OFICINAS.map((of, i) => (
            <View key={i} className="gap-1">
              <View className="flex-row items-center gap-1">
                <MapPin size={14} color={colors.textMuted} />
                <Text className="font-lm-medium text-text">{of.nombre}</Text>
              </View>
              <Text className="text-text-muted text-xs">{of.direccion}</Text>
              <Text className="text-text-muted text-xs">{of.horario}</Text>
              <TouchableOpacity
                onPress={() => Linking.openURL(of.linkMapa)}
                className="flex-row items-center gap-1 mt-1"
              >
                <ExternalLink size={12} color={colors.primaryDark} />
                <Text className="text-xs text-primary-dark">Ver en Google Maps</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {nonBankMethod === "qr" && modo === "PENtoBOB" && (
        <View className="border border-border rounded-lg bg-surface p-3 items-center">
          <Text className="text-xs text-text-muted mb-2">Tu QR para recibir en Bolivia (Bolivianos)</Text>
          {loadingQrUser ? (
            <Bone className="w-36 h-36 rounded-xl" />
          ) : qrUserAccount ? (
            <View className="items-center gap-2">
              <View className="bg-background p-2 rounded-xl border border-border">
                <Image source={{ uri: qrUserAccount.qr_value }} style={{ width: 130, height: 130 }} resizeMode="contain" />
              </View>
              <Text className="text-xs text-success font-lm-medium">QR guardado</Text>
              <TouchableOpacity onPress={onAgregarQR} className="flex-row items-center gap-1">
                <CreditCard size={12} color={colors.primaryDark} />
                <Text className="text-xs text-primary-dark">Cambiar QR</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="items-center gap-2">
              <Text className="text-xs text-text text-center">No tienes un QR registrado para Bolivia.</Text>
              <TouchableOpacity onPress={onAgregarQR} className="flex-row items-center gap-2 bg-primary px-4 py-2 rounded-lg">
                <CreditCard size={14} color={colors.text} />
                <Text className="text-text font-lm-medium text-xs">Agregar QR</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
