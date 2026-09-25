import { ScrollView } from "react-native";
import { FOOTER_CLEARANCE } from "../../components/FooterLayout/FooterBar";
import HeaderUser from "../../components/UserDropdown/HeaderUser";
import { useTransferWizard } from "../../components/Tranferencia/hooks/useTransferWizard";
import ProgressBar from "../../components/Tranferencia/ProgressBar";
import Cotiza from "../../components/Tranferencia/Cotiza";
import OperacionStep from "../../components/Tranferencia/OperacionStep";
import Transfiere from "../../components/Tranferencia/Transfiere";
import Finalizar from "../../components/Tranferencia/Finalizar";

export default function Cambiar() {
  const { step, operacion, setOperacion, nextStep, prevStep } = useTransferWizard();

  return (
    <ScrollView
      className="flex-1 bg-background px-6"
      contentContainerStyle={{ paddingBottom: FOOTER_CLEARANCE }}
    >
      <HeaderUser title="Nueva Operación" subtitle="Realiza transferencias de forma rápida y segura" />

      <ProgressBar step={step} />

      {step === 1 && <Cotiza onNext={nextStep} operacion={operacion} setOperacion={setOperacion} />}
      {step === 2 && <OperacionStep onNext={nextStep} onBack={prevStep} operacion={operacion} setOperacion={setOperacion} />}
      {step === 3 && <Transfiere onNext={nextStep} onBack={prevStep} operacion={operacion} setOperacion={setOperacion} />}
      {step === 4 && <Finalizar onBack={prevStep} operacion={operacion} setOperacion={setOperacion} />}
    </ScrollView>
  );
}
