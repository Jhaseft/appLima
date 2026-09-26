import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { guardarCuenta, listarCuentasConBanco } from "../services/cuentasModalApi";
import { getBancos } from "./useBancos";
import { useFeedback } from "../../Feedback/FeedbackContext";

// Guardado de cuenta bancaria (origen/destino): POST + re-fetch de la lista con
// banco asociado + cache + callback al padre + feedback. Lo usan los modales
// Bancaria y Destino; solo cambia el payload.
export function useGuardarCuenta({ user, onCuentaGuardada, onClose }) {
  const feedback = useFeedback();
  const [loading, setLoading] = useState(false);

  const guardar = async (payload) => {
    setLoading(true);
    try {
      await guardarCuenta({ user_id: user.id, ...payload });
      const cuentas = await listarCuentasConBanco(user.id, getBancos());
      await AsyncStorage.setItem("cuentasUsuario", JSON.stringify(cuentas));
      onCuentaGuardada?.(cuentas);
      setLoading(false);
      onClose?.();
      feedback.success("Cuenta guardada correctamente");
    } catch (err) {
      setLoading(false);
      onClose?.();
      if (!err?.isRateLimit && !err?.isBlocked)
        feedback.error(err.message || "No se pudo guardar la cuenta");
    }
  };

  return { loading, guardar };
}
