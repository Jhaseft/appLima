import { View, Text, Pressable } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Stack, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { useRegisterForm } from "../components/Register/hooks/useRegisterForm";
import ProgressBar from "../components/Register/ProgressBar";
import Step1Personal from "../components/Register/Step1Personal";
import Step2Extras from "../components/Register/Step2Extras";
import Step3Security from "../components/Register/Step3Security";
import StepNavigation from "../components/Register/StepNavigation";
import GoogleBoton from "../components/GoogleBoton";
import AppleBoton from "../components/AppleBoton";
import { useLoginHandlers } from "../components/hooks/useLoginHandlers";
import { colors } from "../theme/colors";

export default function Register() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { step, form, errors, loading, setData, nextStep, prevStep, register, canSubmit } =
    useRegisterForm();
  const { handleGoogleLogin, handleAppleLogin } = useLoginHandlers();

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top+10 }}>
      <Stack.Screen options={{ headerShown: false }} />

      <ProgressBar step={step} totalSteps={3} />

      <Pressable onPress={() => router.back()} hitSlop={12} className="self-start ml-4 p-2 mt-4 mb-2">
        <ArrowLeft size={26} color={colors.text} />
      </Pressable>

      <KeyboardAwareScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 40 }}
        extraScrollHeight={20}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-2xl font-lm-bold mb-6 text-text">Crear una cuenta nueva</Text>

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
    </View>
  );
}
