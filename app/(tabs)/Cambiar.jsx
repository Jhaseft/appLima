import { View } from "react-native";
import HeaderUser from "../../components/UserDropdown/HeaderUser";
import { useTransferWizard } from "../../components/Tranferencia/hooks/useTransferWizard";
import { useRateChangeNotice } from "../../components/Tranferencia/hooks/useRateChangeNotice";
import ProgressBar from "../../components/Tranferencia/ProgressBar";
import RateChangeBanner from "../../components/Tranferencia/RateChangeBanner";
import Cotiza from "../../components/Tranferencia/Cotiza";
import OperacionStep from "../../components/Tranferencia/OperacionStep";
import Transfiere from "../../components/Tranferencia/Transfiere";
import Finalizar from "../../components/Tranferencia/Finalizar";

export default function Cambiar() {
  const { step, operacion, setOperacion, nextStep, prevStep, goToStep } = useTransferWizard();
  const rate = useRateChangeNotice();

  const goNext = () => {
    rate.verificar();
    nextStep();
  };

  return (
    <View className="flex-1 bg-background">
      <HeaderUser title="Nueva Operación" subtitle="Realiza transferencias de forma rápida y segura" />

      <View className="px-6">
        <ProgressBar step={step} />
      </View>

      <View className="flex-1">
        {step === 1 && <Cotiza onNext={goNext} operacion={operacion} setOperacion={setOperacion} />}
        {step === 2 && <OperacionStep onNext={goNext} onBack={prevStep} operacion={operacion} setOperacion={setOperacion} />}
        {step === 3 && <Transfiere onNext={goNext} onBack={prevStep} operacion={operacion} setOperacion={setOperacion} />}
        {step === 4 && (
          <Finalizar
            onBack={prevStep}
            operacion={operacion}
            setOperacion={setOperacion}
            verificar={rate.verificar}
            onVolverACotizar={() => goToStep(1)}
          />
        )}
      </View>

      <RateChangeBanner notice={rate.notice} onHide={rate.dismiss} />
    </View>
  );
}
