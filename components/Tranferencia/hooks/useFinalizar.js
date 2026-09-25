import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { useResumen } from "../../Home/ResumenContext";
import { useFeedback } from "../../Feedback/FeedbackContext";
import { crearTransferencia } from "../services/transferenciaApi";
import { invalidarTransfers } from "../../TranfersHistory/useTransfers";

const MAX_COMPROBANTES = 5;

// Orquestacion del paso Finalizar: seleccion de comprobantes (hasta 5) y envio
// de la operacion (mutacion) con el overlay global de carga (feedback.withLoading).
export function useFinalizar({ operacion, setOperacion }) {
  const [comprobantes, setComprobantes] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();
  const { refrescar: refrescarResumen } = useResumen();
  const feedback = useFeedback();

  const isBOBtoPEN = operacion.modo === "BOBtoPEN";
  const slug = operacion.nonBankMethod;
  const comprobanteOpcional = isBOBtoPEN && slug === "cash";

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

  const handleEnviar = async () => {
    if (!comprobanteOpcional && comprobantes.length === 0) {
      setError("Por favor, sube al menos un comprobante.");
      return;
    }
    setError("");
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
    handlePick,
    handleRemove,
    handleEnviar,
  };
}
