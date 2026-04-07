import { useState } from "react";
import { ScrollView, Text } from "react-native";
import FooterLayout from "../FooterLayout/FooterLayout";
import HeaderUser from "../UserDropdown/HeaderUser";
import { useUser } from "../ContextUser/UserContext";

import ProgressBar from "./ProgressBar";
import Cotiza from "./Cotiza";
import MetodoPago from "./MetodoPago";
import SelectAccounts from "./SelectAccounts";
import Transfiere from "./Transfiere";
import Finalizar from "./Finalizar";
import FinalizarEfectivo from "./FinalizarEfectivo";

export default function Cambiar() {
  const { user } = useUser();
  const [step, setStep] = useState(1);

  // Estado central de la operación
  const [operacion, setOperacion] = useState({
    monto: "",
    conversion: "",
    modo: "PENtoBOB",
    tasa: null,
    metodo: null, // "transferencia" | "efectivo"
    cuentaOrigen: null,
    cuentaDestino: null,
    comprobante: null,
  });

  // nextStep recibe el metodo solo cuando viene del paso 2 (MetodoPago)
  const nextStep = (metodo) => {
    if (step === 2) {
      const m = metodo || operacion.metodo;
      if (m === "efectivo") {
        setStep(5); // saltar directo al paso de efectivo
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    if (step === 5 && operacion.metodo === "efectivo") {
      setStep(2); // volver a selección de método
      return;
    }
    setStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <FooterLayout>
      <ScrollView
        className="flex-1 bg-white px-6"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <HeaderUser title="Nueva Operación" />
        <Text className="text-xl my-6 text-center">
          Cambia de forma económica, fácil y segura
        </Text>
        <ProgressBar step={step} />

        {step === 1 && (
          <Cotiza
            onNext={nextStep}
            operacion={operacion}
            setOperacion={setOperacion}
          />
        )}
        {step === 2 && (
          <MetodoPago
            onNext={nextStep}
            onBack={prevStep}
            operacion={operacion}
            setOperacion={setOperacion}
          />
        )}
        {step === 3 && (
          <SelectAccounts
            onNext={nextStep}
            onBack={prevStep}
            operacion={operacion}
            setOperacion={setOperacion}
          />
        )}
        {step === 4 && (
          <Transfiere
            onNext={nextStep}
            onBack={prevStep}
            operacion={operacion}
            setOperacion={setOperacion}
          />
        )}
        {step === 5 && operacion.metodo === "efectivo" && (
          <FinalizarEfectivo
            onBack={prevStep}
            operacion={operacion}
            setOperacion={setOperacion}
          />
        )}
        {step === 5 && operacion.metodo === "transferencia" && (
          <Finalizar
            onBack={prevStep}
            operacion={operacion}
            setOperacion={setOperacion}
          />
        )}
      </ScrollView>
    </FooterLayout>
  );
}
