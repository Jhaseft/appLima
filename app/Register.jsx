import { View, Text, Image } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Stack } from "expo-router";
import { useRegisterForm } from "../components/Register/hooks/useRegisterForm";
import ProgressBar from "../components/Register/ProgressBar";
import Step1Personal from "../components/Register/Step1Personal";
import Step2Extras from "../components/Register/Step2Extras";
import Step3Security from "../components/Register/Step3Security";
import StepNavigation from "../components/Register/StepNavigation";
import GoogleBoton from "../components/GoogleBoton";
import AppleBoton from "../components/AppleBoton";
import { useLoginHandlers } from "../components/hooks/useLoginHandlers";

export default function Register() {
  const { step, form, errors, loading, setData, nextStep, prevStep, register, canSubmit } =
    useRegisterForm();
  const { handleGoogleLogin, handleAppleLogin } = useLoginHandlers();

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-background px-6 py-10"
      extraScrollHeight={20}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
    >
      <Stack.Screen
        options={{
          headerTitle: () => (
            <Image
              source={require("../assets/images/Logo_web_03.png")}
              style={{ width: 190, height: 50, resizeMode: "contain" }}
            />
          ),
          headerTitleAlign: "center",
          title: "",
          headerBackButtonDisplayMode: "minimal",
          headerShadowVisible: false,
        }}
      />

      <Text className="text-2xl font-lm-bold mb-6 text-center text-text">
        Crear una cuenta nueva
      </Text>
      <ProgressBar step={step} totalSteps={3} />

      <View className="space-y-6">
        {step === 1 && <Step1Personal data={form} setData={setData} errors={errors} />}
        {step === 2 && <Step2Extras data={form} setData={setData} errors={errors} />}
        {step === 3 && <Step3Security data={form} setData={setData} errors={errors} />}
      </View>

      <StepNavigation
        step={step}
        loading={loading}
        canSubmit={canSubmit}
        onPrev={prevStep}
        onNext={nextStep}
        onSubmit={register}
      />

      <GoogleBoton handleGoogleLogin={handleGoogleLogin} />
      <AppleBoton handleAppleLogin={handleAppleLogin} />
    </KeyboardAwareScrollView>
  );
}
