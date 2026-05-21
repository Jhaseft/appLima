import { useState, useEffect } from "react";
import { ScrollView, Text, BackHandler } from "react-native";
import FooterLayout from "../FooterLayout/FooterLayout";
import HeaderUser from "../UserDropdown/HeaderUser";

import ProgressBar from "./ProgressBar";
import Cotiza from "./Cotiza";
import OperacionStep from "./OperacionStep";
import Transfiere from "./Transfiere";
import Finalizar from "./Finalizar";

export default function Cambiar() {
  const [step, setStep] = useState(1);

  const [operacion, setOperacion] = useState({
    monto: "",
    conversion: "",
    modo: "PENtoBOB",
    tasa: null,
    metodo: null,           // 'transferencia' | 'qr' | 'cash' (derivado en OperacionStep)
    nonBankMethod: null,    // 'cash' | 'qr' (lado no-banco)
    cuentaOrigen: null,
    cuentaDestino: null,
    cuentaQR: null,
    comprobantes: [],
  });

  const nextStep = () => setStep((p) => Math.min(p + 1, 4));
  const prevStep = () => setStep((p) => Math.max(p - 1, 1));

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

  return (
    <FooterLayout>
      <ScrollView
        className="flex-1 bg-white px-6"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <HeaderUser title="Nueva Operación" subtitle="Realiza transferencias de forma rápida y segura" />

        <ProgressBar step={step} />

        {step === 1 && (
          <Cotiza
            onNext={nextStep}
            operacion={operacion}
            setOperacion={setOperacion}
          />
        )}
        {step === 2 && (
          <OperacionStep
            onNext={nextStep}
            onBack={prevStep}
            operacion={operacion}
            setOperacion={setOperacion}
          />
        )}
        {step === 3 && (
          <Transfiere
            onNext={nextStep}
            onBack={prevStep}
            operacion={operacion}
            setOperacion={setOperacion}
          />
        )} 
        {step === 4 && (
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
