import { useState } from "react";
import { ScrollView, Text } from "react-native";
import FooterLayout from "../FooterLayout/FooterLayout";
import HeaderUser from "../UserDropdown/HeaderUser";
import { useUser } from "../ContextUser/UserContext";

import ProgressBar from "./ProgressBar";
import Cotiza from "./Cotiza";
import SelectAccounts from "./SelectAccounts";
import Transfiere from "./Transfiere";
import Finalizar from "./Finalizar";

export default function Cambiar() {
  const { user } = useUser(); 
  const [step, setStep] = useState(1);

  // 🔥 Estado central de la operación
  const [operacion, setOperacion] = useState({
    monto: "",
    conversion: "",
    modo: "PENtoBOB",
    tasa: null,
    cuentaOrigen: null,
    cuentaDestino: null,
    comprobante: null,
  });

  
  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, 4));
  };
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

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
          <SelectAccounts
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
