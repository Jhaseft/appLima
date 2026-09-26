import { Linking, Platform } from "react-native";
import { useFeedback } from "../Feedback/FeedbackContext";
import {
  registrarOperacionExitosa,
  debePedirCalificacion,
  marcarCalificado,
  posponerCalificacion,
} from "../services/appRatingStore";

const PACKAGE = "com.transfercash.lima";
const PLAY_MARKET = `market://details?id=${PACKAGE}`;
const PLAY_WEB = `https://play.google.com/store/apps/details?id=${PACKAGE}`;

// Invitacion a calificar la app en la Play Store. La condicion (cuantas
// operaciones, si ya califico, cada cuanto reintentar) vive en appRatingStore.
export function useAppRating() {
  const feedback = useFeedback();

  const abrirTienda = async () => {
    const url = Platform.OS === "android" ? PLAY_MARKET : PLAY_WEB;
    try {
      const soportado = await Linking.canOpenURL(url);
      await Linking.openURL(soportado ? url : PLAY_WEB);
    } catch (_) {
      Linking.openURL(PLAY_WEB).catch(() => {});
    }
  };

  const pedirCalificacionSiCorresponde = async () => {
    await registrarOperacionExitosa();
    if (!(await debePedirCalificacion())) return;

    const ok = await feedback.confirm({
      title: "¿Te gusta TransferCash?",
      message: "Tu opinión nos ayuda muchísimo. ¿Quieres calificarnos en Google Play?",
      confirmText: "Calificar",
      cancelText: "Ahora no",
    });

    if (ok) {
      await marcarCalificado();
      await abrirTienda();
    } else {
      await posponerCalificacion();
    }
  };

  return { pedirCalificacionSiCorresponde };
}
