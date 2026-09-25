import { useEffect, useState } from "react";
import { BackHandler } from "react-native";

const OPERACION_INICIAL = {
  monto: "",
  conversion: "",
  modo: "PENtoBOB",
  tasa: null,
  metodo: null,
  nonBankMethod: null,
  cuentaOrigen: null,
  cuentaDestino: null,
  cuentaQR: null,
  comprobantes: [],
};

// Maquina de pasos del wizard de transferencia (4 pasos) + estado de la
// operacion compartido entre pasos. El boton fisico de atras retrocede un paso.
export function useTransferWizard() {
  const [step, setStep] = useState(1);
  const [operacion, setOperacion] = useState(OPERACION_INICIAL);

  const nextStep = () => setStep((p) => Math.min(p + 1, 4));
  const prevStep = () => setStep((p) => Math.max(p - 1, 1));
  const goToStep = (n) => setStep(Math.min(Math.max(n, 1), 4));

  useEffect(() => {
    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (step > 1) {
        prevStep();
        return true;
      }
      return false;
    });
    return () => handler.remove();
  }, [step]);

  return { step, operacion, setOperacion, nextStep, prevStep, goToStep };
}
