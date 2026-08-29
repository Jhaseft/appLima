import { View, Pressable } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { useRegisterFlow } from "../components/Register/hooks/useRegisterFlow";
import { useLoginHandlers } from "../components/hooks/useLoginHandlers";
import ProgressBar from "../components/ProgressBar";
import { buildAccountSteps } from "../components/accountSteps";
import StepEmail from "../components/Register/StepEmail";
import StepPassword from "../components/Register/StepPassword";
import StepCode from "../components/Register/StepCode";
import { colors } from "../theme/colors";

export default function Register() {
  const insets = useSafeAreaInsets();
  const flow = useRegisterFlow();
  const { handleGoogleLogin, handleAppleLogin } = useLoginHandlers();

  return (
    <View
      className="flex-1 bg-background"style={{ paddingTop: insets.top + 12}}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <ProgressBar steps={buildAccountSteps(false)} current={1} />

      <Pressable onPress={flow.back} hitSlop={12} className="self-start ml-4 p-2 mt-4 mb-2">
        <ArrowLeft size={26} color={colors.text} />
      </Pressable>

      <KeyboardAwareScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 40 }}
        extraScrollHeight={20}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
      >
        {flow.phase === "email" && (
          <StepEmail
            email={flow.email}
            setEmail={flow.setEmail}
            valid={flow.emailValid}
            onContinue={flow.goToPassword}
            onGoogle={handleGoogleLogin}
            onApple={handleAppleLogin}
          />
        )}

        {flow.phase === "password" && (
          <StepPassword
            password={flow.password}
            setPassword={flow.setPassword}
            confirm={flow.confirm}
            setConfirm={flow.setConfirm}
            valid={flow.passwordValid}
            onContinue={flow.submitRegister}
          />
        )}

        {flow.phase === "code" && (
          <StepCode
            email={flow.email}
            code={flow.code}
            setCode={flow.setCode}
            onVerify={flow.verify}
          />
        )}
      </KeyboardAwareScrollView>
    </View>
  );
}
