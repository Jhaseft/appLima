import { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Switch } from "react-native";
import { Copy } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import { colors } from "../../theme/colors";
import { useTransferMethods } from "../hooks/useTransferMethods";
import { useTasaActual, calcularConversion } from "./hooks/useTasaActual";
import Bone from "../Home/Bone";
import { OFICINAS } from "./data/oficinas";
import OficinaCard from "./OficinaCard";

export default function Transfiere({ onNext, onBack, operacion }) {
  const [confirmado, setConfirmado] = useState(false);
  const { methods: opciones, loading: loadingMethods } = useTransferMethods(operacion.modo);

  const { compra, venta } = useTasaActual();
  const isBOBtoPEN = operacion.modo === "BOBtoPEN";
  const slug = operacion.nonBankMethod;

  const tasaVigente = isBOBtoPEN ? venta : compra;
  const conversionVigente = calcularConversion(operacion.monto, operacion.modo, { compra, venta });

  const montoTexto = isBOBtoPEN ? `${operacion.monto} BOB` : `${operacion.monto} PEN`;
  const conversionTexto = isBOBtoPEN ? `${conversionVigente} PEN` : `${conversionVigente} BOB`;

  const showOficinas = isBOBtoPEN && slug === "cash";
  const showQrEmpresa = isBOBtoPEN && slug === "qr";
  const bankOps = !isBOBtoPEN ? opciones.filter((m) => m.type !== "qr") : [];
  const qrEmpresa = showQrEmpresa ? opciones.find((m) => m.type === "qr") : null;

  const copyToClipboard = (text) => Clipboard.setStringAsync(text);

  return (
    <ScrollView className="flex-1 bg-background px-4 py-4">
      <Text className="text-xl font-lm-bold text-text text-center mb-4">
        {showOficinas ? "Pago en oficina" : "Realiza tu transferencia"}
      </Text>

      <View className="border border-border rounded-lg bg-surface p-4 mb-6">
        <Text className="text-text"><Text className="font-lm-bold">Conversión:</Text> {operacion.modo}</Text>
        <Text className="text-text"><Text className="font-lm-bold">Monto a enviar:</Text> {montoTexto}</Text>
        <Text className="text-text"><Text className="font-lm-bold">Monto a recibir:</Text> {conversionTexto}</Text>
        <Text className="text-text"><Text className="font-lm-bold">Tasa:</Text> {tasaVigente}</Text>
      </View>

      {showOficinas && (
        <View className="bg-text rounded-xl p-4 mb-4">
          <Text className="text-primary font-lm-bold text-base text-center mb-3">Acércate a nuestra oficina</Text>
          {OFICINAS.map((of, i) => (
            <OficinaCard key={i} oficina={of} />
          ))}
        </View>
      )}

      {showQrEmpresa && (
        <View className="gap-3 mb-4">
          <Text className="text-text font-lm-medium">Escanea el QR para pagar</Text>
          {loadingMethods ? (
            <Bone className="w-60 h-60 rounded-lg self-center" />
          ) : qrEmpresa ? (
            <View className="items-center p-4 border border-border rounded-lg bg-background shadow">
              <Image source={{ uri: qrEmpresa.image }} className="w-60 h-60" resizeMode="contain" />
            </View>
          ) : (
            <Text className="text-danger text-sm text-center">No hay QR de empresa configurado.</Text>
          )}
        </View>
      )}

      {!isBOBtoPEN && (
        <View className="gap-3 mb-4">
          <Text className="text-text font-lm-medium">Realiza el depósito a:</Text>
          {loadingMethods ? (
            <>
              <Bone className="h-20 rounded-lg" />
              <Bone className="h-20 rounded-lg" />
            </>
          ) : bankOps.length === 0 ? (
            <Text className="text-text-muted text-sm text-center">Sin métodos disponibles</Text>
          ) : (
            bankOps.map((op, idx) => (
              <View key={idx} className="flex-row items-center gap-3 border border-border rounded-lg p-3 bg-background shadow">
                <Image source={{ uri: op.image }} className="w-12 h-12" resizeMode="contain" />
                <View className="flex-1">
                  <Text className="font-lm-bold text-text">{op.title}</Text>
                  <Text className="text-text-muted">Número: {op.number}</Text>
                </View>
                <TouchableOpacity onPress={() => copyToClipboard(op.number)}>
                  <Copy size={20} color={colors.text} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      )}

      {showOficinas && (
        <View className="border border-primary-accent rounded-lg bg-primary-light p-3 mt-4">
          <Text className="text-primary-dark text-xs">
            Al continuar, reservas este tipo de cambio. Acércate a nuestra oficina para pagar en efectivo y completar la operación.
          </Text>
        </View>
      )}

      <View className="flex-row items-center justify-between mt-6 px-2">
        <Text className="text-text font-lm-medium flex-1 pr-2">
          {showOficinas ? "Confirmo que pagaré en oficina con este tipo de cambio" : "Ya envié el dinero"}
        </Text>
        <Switch value={confirmado} onValueChange={setConfirmado} trackColor={{ true: colors.primary }} />
      </View>

      <View className="flex-row justify-between mt-10 mb-8">
        <TouchableOpacity onPress={onBack} className="bg-border px-6 py-3 rounded-lg">
          <Text className="text-text font-lm-medium">Atrás</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!confirmado}
          onPress={onNext}
          className={`px-6 py-3 rounded-lg ${confirmado ? "bg-primary" : "bg-border"}`}
        >
          <Text className="text-text font-lm-bold">Siguiente</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
