import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { useResumen } from "../../Home/ResumenContext";
import { useFeedback } from "../../Feedback/FeedbackContext";
import { crearTransferencia } from "../services/transferenciaApi";
import { invalidarTransfers } from "../../TranfersHistory/useTransfers";
import { useTasaActual, calcularConversion } from "./useTasaActual";

const MAX_COMPROBANTES = 5;

// Orquestacion del paso Finalizar: resumen con tasa vigente, seleccion de
// comprobantes (hasta 5) y envio de la operacion (mutacion) con el overlay global
// de carga. Revalida la tasa al enviar (el backend cobra con la ultima).
export function useFinalizar({ operacion, setOperacion, verificar, onVolverACotizar }) {
  const [comprobantes, setComprobantes] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();
  const { refrescar: refrescarResumen } = useResumen();
  const feedback = useFeedback();

  const isBOBtoPEN = operacion.modo === "BOBtoPEN";
  const slug = operacion.nonBankMethod;
  const comprobanteOpcional = isBOBtoPEN && slug === "cash";

  const { compra, venta } = useTasaActual();
  const tasaVigente = isBOBtoPEN ? venta : compra;
  const conversionVigente = calcularConversion(operacion.monto, operacion.modo, { compra, venta });

  const handlePick = async () => {
    try {
      if (comprobantes.length >= MAX_COMPROBANTES) {
        setError(`Solo puedes subir hasta ${MAX_COMPROBANTES} comprobantes.`);
        return;
      }
      const res = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
        multiple: true,
      });
      if (res.canceled) return;

      const picked = res.assets || (res.uri ? [res] : []);
      const disponibles = MAX_COMPROBANTES - comprobantes.length;
      const aAgregar = picked.slice(0, disponibles);
      const nuevos = [...comprobantes, ...aAgregar];
      setComprobantes(nuevos);
      setOperacion((prev) => ({ ...prev, comprobantes: nuevos }));
      setError(picked.length > disponibles ? `Solo se agregaron ${disponibles}. Máximo ${MAX_COMPROBANTES}.` : "");
    } catch (err) {
      setError(`No se pudo seleccionar el comprobante: ${err.message}`);
    }
  };

  const handleRemove = (idx) => {
    const nuevos = comprobantes.filter((_, i) => i !== idx);
    setComprobantes(nuevos);
    setOperacion((prev) => ({ ...prev, comprobantes: nuevos }));
  };

  const construirFormData = () => {
    const formData = new FormData();
    formData.append("amount", operacion.monto);
    formData.append("modo", operacion.modo);
    formData.append("payment_method_slug", isBOBtoPEN ? "bank_transfer" : slug);

    if (!isBOBtoPEN) {
      if (operacion.cuentaOrigen?.id) formData.append("origin_account_id", operacion.cuentaOrigen.id);
      if (slug === "qr" && operacion.cuentaQR?.id) formData.append("destination_account_id", operacion.cuentaQR.id);
    } else {
      if (operacion.cuentaDestino?.id) formData.append("destination_account_id", operacion.cuentaDestino.id);
      if (slug === "qr" && operacion.cuentaOrigen?.id) formData.append("origin_account_id", operacion.cuentaOrigen.id);
    }

    comprobantes.forEach((c, idx) => {
      formData.append("comprobantes[]", {
        uri: c.uri,
        name: c.name || `comprobante_${idx + 1}.jpg`,
        type: c.mimeType || "image/jpeg",
      });
    });

    return formData;
  };

  // Revalida la tasa con un fetch on-demand (verificar tambien actualiza el
  // resumen y dispara el banner). Si cambio respecto a la que vio el usuario,
  // confirma; si cancela, vuelve a la calculadora con el nuevo valor.
  const revalidarTasa = async () => {
    let lista = null;
    try {
      lista = await verificar?.();
    } catch (_) {}

    const ultima = lista?.length ? lista[lista.length - 1] : null;
    const nueva = ultima ? parseFloat(isBOBtoPEN ? ultima.venta : ultima.compra) : null;
    if (!nueva || !operacion.tasa) return true;
    if (nueva.toFixed(2) === Number(operacion.tasa).toFixed(2)) return true;

    const ok = await feedback.confirm({
      title: "El tipo de cambio cambió",
      message: `La tasa pasó de ${Number(operacion.tasa).toFixed(2)} a ${nueva.toFixed(2)}. Se aplicará la última. ¿Deseas continuar?`,
      confirmText: "Continuar",
      cancelText: "Volver a cotizar",
    });
    if (!ok) onVolverACotizar?.();
    return ok;
  };

  const handleEnviar = async () => {
    if (!comprobanteOpcional && comprobantes.length === 0) {
      setError("Por favor, sube al menos un comprobante.");
      return;
    }
    setError("");
    if (!(await revalidarTasa())) return;
    try {
      const data = await feedback.withLoading("Enviando operación...", () =>
        crearTransferencia(construirFormData())
      );
      invalidarTransfers();
      refrescarResumen();
      await feedback.success(
        `Tu operación fue registrada correctamente.\nN° de operación: ${data.transfer_number}`,
        { title: "Operación Registrada" }
      );
      router.replace("/TransfersHistory");
    } catch (_) {
      feedback.error(
        "No se pudo enviar la transferencia. Intenta nuevamente; si el problema persiste contacta al +591 63892482"
      );
    }
  };

  return {
    comprobantes,
    error,
    comprobanteOpcional,
    maxComprobantes: MAX_COMPROBANTES,
    isOriginBank: !isBOBtoPEN,
    tasaVigente,
    conversionVigente,
    handlePick,
    handleRemove,
    handleEnviar,
  };
}
