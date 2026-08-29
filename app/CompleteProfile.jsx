import { View, Text, Pressable } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { useCompleteProfile } from "../components/CompleteProfile/hooks/useCompleteProfile";
import ProgressBar from "../components/ProgressBar";
import { buildAccountSteps } from "../components/accountSteps";
import StepNames from "../components/Register/StepNames";
import Step2Extras from "../components/Register/Step2Extras";
import Step3Security from "../components/Register/Step3Security";
import { colors } from "../theme/colors";

export default function CompleteProfile() {
  const insets = useSafeAreaInsets();
  const { subStep, index, isLast, macroCurrent, requirePassword, form, errors, setData, next, back } =
    useCompleteProfile();

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom }}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <ProgressBar steps={buildAccountSteps(requirePassword)} current={macroCurrent} />

      {index > 0 ? (
        <Pressable onPress={back} hitSlop={12} className="self-start ml-4 p-2 mt-4 mb-2">
          <ArrowLeft size={26} color={colors.text} />
        </Pressable>
      ) : null}

      <KeyboardAwareScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 40 }}
        extraScrollHeight={20}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
      >
        {subStep === "personal" && (
          <>
            <Text className="text-3xl font-lm-bold text-text mb-2">Información personal</Text>
            <Text className="text-text-muted font-sans mb-8">¿Cómo te llamas?</Text>
            <StepNames data={form} setData={setData} errors={errors} />
          </>
        )}

        {subStep === "extra" && (
          <>
            <Text className="text-3xl font-lm-bold text-text mb-2">Información extra</Text>
            <Text className="text-text-muted font-sans mb-8">
              Teléfono, nacionalidad y documento.
            </Text>
            <Step2Extras data={form} setData={setData} errors={errors} />
          </>
        )}

        {subStep === "security" && (
          <>
            <Text className="text-3xl font-lm-bold text-text mb-2">Seguridad</Text>
            <Text className="text-text-muted font-sans mb-8">
              Crea tu contraseña de acceso.
            </Text>
            <Step3Security data={form} setData={setData} errors={errors} requirePassword />
          </>
        )}

        <Pressable
          onPress={next}
          className="w-full py-4 rounded-2xl mt-6 mb-10 bg-primary active:opacity-80"
        >
          <Text className="text-center text-text font-lm-bold text-lg">
            {isLast ? "Crear cuenta" : "Continuar"}
          </Text>
        </Pressable>
      </KeyboardAwareScrollView>
    </View>
  );
}
