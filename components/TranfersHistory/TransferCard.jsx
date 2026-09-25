import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { getStatusColor, getTypeLabel } from "./transferUtils";
import ReceiptModal from "./ReceiptModal";

function OwnerInfo({ owner }) {
  if (!owner) return <Text className="text-text-muted">-</Text>;
  return (
    <View className="mt-1 gap-0.5">
      <Text className="text-text">Nombre: {owner.full_name}</Text>
      <Text className="text-text">Doc: {owner.document_number}</Text>
      <Text className="text-text">Tel: {owner.phone}</Text>
    </View>
  );
}

function AccountLine({ label, acc, nullLabel = "No aplica" }) {
  if (!acc) return <Text className="text-text-muted">{label}: {nullLabel}</Text>;
  return (
    <Text className="text-text">
      {label}: {acc.numero ?? "-"} - {acc.banco ?? "-"}
    </Text>
  );
}

function ReceiptButtons({ receipts, onOpen }) {
  if (!receipts || receipts.length === 0) return null;

  const clientImgs = receipts.filter((r) => r.receipt_type === "client");
  const adminImgs = receipts.filter((r) => r.receipt_type === "admin");

  return (
    <View className="flex-row gap-2 mt-3">
      {clientImgs.length > 0 && (
        <TouchableOpacity
          onPress={() => onOpen(clientImgs, "Mi comprobante")}
          className="flex-1 bg-primary py-2 rounded-xl items-center"
        >
          <Text className="text-text font-lm-medium text-sm">Mi comprobante</Text>
        </TouchableOpacity>
      )}
      {adminImgs.length > 0 && (
        <TouchableOpacity
          onPress={() => onOpen(adminImgs, "Pago realizado")}
          className="flex-1 bg-success py-2 rounded-xl items-center"
        >
          <Text className="text-background font-lm-medium text-sm">Pago realizado</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function TransferCard({ transfer: t }) {
  const [modal, setModal] = useState({ visible: false, images: [], title: "" });
  const slug = t.payment_method?.slug ?? "bank_transfer";
  const isCash = slug === "cash";
  const isQR = slug === "qr";
  const hasAccounts = !isCash && !isQR;

  const openModal = (images, title) => setModal({ visible: true, images, title });
  const closeModal = () => setModal({ visible: false, images: [], title: "" });

  return (
    <>
      <View className="bg-background p-5 rounded-2xl shadow-lg border border-border mb-5">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-xl font-lm-bold text-text">#{t.id}</Text>
          <Text className="text-text-muted text-sm">{t.fecha}</Text>
          <Text className="px-3 py-1 rounded-full font-lm-medium text-sm" style={{ color: getStatusColor(t.estado) }}>
            {t.estado}
          </Text>
        </View>

        <View className="bg-surface p-3 rounded-lg mb-3 gap-1">
          <Text className="text-text">Tipo: {t.payment_method?.name ?? getTypeLabel(slug)}</Text>
          <Text className="text-text">Monto: {t.monto} {t.modo === "PENtoBOB" ? "S/" : "Bs"}</Text>
          <Text className="text-text">Monto Conv: {t.converted_amount} {t.modo === "PENtoBOB" ? "Bs" : "S/"}</Text>
          <Text className="text-text">Modo: {t.modo}</Text>
        </View>

        {hasAccounts ? (
          <>
            <View className="bg-surface p-3 rounded-lg mb-3 gap-1">
              <AccountLine label="Origen" acc={t.origen} nullLabel="Se recibió en efectivo" />
              <AccountLine label="Destino" acc={t.destino} nullLabel="Se recibió en efectivo" />
            </View>
            <View className="bg-surface p-3 rounded-lg gap-2">
              <Text className="text-text font-lm-medium mt-2">Propietario Destino:</Text>
              <OwnerInfo owner={t.destino?.owner} />
            </View>
          </>
        ) : (
          <View className="bg-surface p-3 rounded-lg gap-1">
            <Text className="text-text">
              {isCash
                ? "Operación en efectivo — sin cuentas bancarias asociadas."
                : "Operación por QR — sin cuentas bancarias asociadas."}
            </Text>
          </View>
        )}

        <ReceiptButtons receipts={t.receipts} onOpen={openModal} />
      </View>

      <ReceiptModal visible={modal.visible} images={modal.images} title={modal.title} onClose={closeModal} />
    </>
  );
}
