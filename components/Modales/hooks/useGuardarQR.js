import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { guardarCuenta } from "../services/cuentasModalApi";
import { useFeedback } from "../../Feedback/FeedbackContext";

// Seleccion + subida del QR de cobro (multipart). El QR devuelve una sola cuenta
// que el padre fija por pais (onQRGuardado), a diferencia de las bancarias.
export function useGuardarQR({ user, qrCountry, onQRGuardado, onClose }) {
  const feedback = useFeedback();
  const [imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(false);

  const elegirImagen = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ["image/jpeg", "image/png", "image/jpg"],
        copyToCacheDirectory: true,
      });
      if (res.canceled) return;
      setImagen(res.assets?.[0] || res);
    } catch (err) {
      feedback.error("No se pudo seleccionar la imagen: " + err.message);
    }
  };

  const limpiar = () => setImagen(null);

  const cerrar = () => {
    limpiar();
    onClose?.();
  };

  const guardar = async () => {
    if (!imagen) return feedback.error("Selecciona una imagen de QR.");
    setLoading(true);
    try {
      const form = new FormData();
      form.append("user_id", user.id);
      form.append("method_type", "qr");
      form.append("qr_country", qrCountry);
      form.append("qr_image", {
        uri: imagen.uri,
        name: imagen.name || "qr.jpg",
        type: imagen.mimeType || "image/jpeg",
      });

      const data = await guardarCuenta(form);
      onQRGuardado?.(data);
      feedback.success("QR guardado correctamente");
      limpiar();
      onClose?.();
    } catch (err) {
      feedback.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { imagen, loading, elegirImagen, guardar, cerrar };
}
