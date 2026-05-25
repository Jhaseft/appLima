import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { getStatusColor, getTypeLabel } from "./transferUtils";
import ReceiptModal from "./ReceiptModal";

function OwnerInfo({ owner }) {
  if (!owner) return <Text className="text-gray-500">-</Text>;
  return (
    <View className="mt-1 space-y-0.5">
      <Text className="text-gray-700">Nombre: {owner.full_name}</Text>
      <Text className="text-gray-700">Doc: {owner.document_number}</Text>
      <Text className="text-gray-700">Tel: {owner.phone}</Text>
    </View>
  );
}

function AccountLine({ label, acc, nullLabel = "No aplica" }) {
  if (!acc) return <Text className="text-gray-500">{label}: {nullLabel}</Text>;
  return (
    <Text className="text-gray-700">
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
          className="flex-1 bg-blue-600 py-2 rounded-xl items-center"
        >
          <Text className="text-white font-semibold text-sm">Mi comprobante</Text>
        </TouchableOpacity>
      )}
      {adminImgs.length > 0 && (
        <TouchableOpacity
          onPress={() => onOpen(adminImgs, "Pago realizado")}
          className="flex-1 bg-green-600 py-2 rounded-xl items-center"
        >
          <Text className="text-white font-semibold text-sm">Pago realizado</Text>
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

  const openModal = (images, title) =>
    setModal({ visible: true, images, title });
  const closeModal = () =>
    setModal({ visible: false, images: [], title: "" });

  return (
    <>
     

      <View className="bg-white p-5 rounded-2xl shadow-lg border border-gray-200 mb-5">
        
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-x font-extrabold">#{t.id}</Text>
          <Text className="text-gray-600 text-sm">{t.fecha}</Text>
          <Text
            className="px-3 py-1 rounded-full font-semibold text-sm"
            style={{ color: getStatusColor(t.estado) }}
          >
            {t.estado}
          </Text>
        </View>


        <View className="bg-gray-50 p-3 rounded-lg mb-3 space-y-1">
          <Text className="text-gray-700">
            Tipo: {t.payment_method?.name ?? getTypeLabel(slug)}
          </Text>
          <Text className="text-gray-700">
            Monto: {t.monto} {t.modo === "PENtoBOB" ? "S/" : "Bs"}
          </Text>
          <Text className="text-gray-700">
            Monto Conv: {t.converted_amount}{" "}
            {t.modo === "PENtoBOB" ? "Bs" : "S/"}
          </Text>
          <Text className="text-gray-700">Modo: {t.modo}</Text>
        </View>


        {hasAccounts ? (
          <>
            <View className="bg-gray-50 p-3 rounded-lg mb-3 space-y-1">
              <AccountLine label="Origen" acc={t.origen} nullLabel="Se recibió en efectivo" />
              <AccountLine label="Destino" acc={t.destino} nullLabel="Se recibió en efectivo" />
            </View>
            <View className="bg-gray-50 p-3 rounded-lg space-y-2">
              <Text className="text-gray-800 font-semibold mt-2">
                Propietario Destino:
              </Text>
              <OwnerInfo owner={t.destino?.owner} />
            </View>
          </>
        ) : (
          <View className="bg-gray-50 p-3 rounded-lg space-y-1">
            <Text className="text-gray-700">
              {isCash
                ? "Operación en efectivo — sin cuentas bancarias asociadas."
                : "Operación por QR — sin cuentas bancarias asociadas."}
            </Text>
          </View>
        )}

        <ReceiptButtons receipts={t.receipts} onOpen={openModal} />
      </View>

      <ReceiptModal
        visible={modal.visible}
        images={modal.images}
        title={modal.title}
        onClose={closeModal}
      />
    </>
  );
}
