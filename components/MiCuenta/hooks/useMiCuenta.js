import { Linking } from "react-native";
import { useUser } from "../../ContextUser/UserContext";
import { useFeedback } from "../../Feedback/FeedbackContext";
import { crearSesionKyc } from "../services/kycApi";

const KYC_DEEP_LINK = process.env.EXPO_PUBLIC_KYC_DEEP_LINK;

export function useMiCuenta() {
  const { user } = useUser();
  const feedback = useFeedback();

  const isVerified = user?.kyc_status === "verified";
  const kycLabel = isVerified ? "Verificado" : (user?.kyc_status ?? "Sin verificar");
  const iniciales = user
    ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase()
    : "?";
  const nombre = user ? `${user.first_name} ${user.last_name}` : "—";

  const iniciarKyc = async () => {
    try {
      const url = await crearSesionKyc(KYC_DEEP_LINK);
      await Linking.openURL(url);
    } catch {
      feedback.error("Hubo un problema al iniciar la verificación KYC.");
    }
  };

  return { user, isVerified, kycLabel, iniciales, nombre, iniciarKyc };
}
