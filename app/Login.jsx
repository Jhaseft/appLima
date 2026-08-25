import { KeyboardAvoidingView, Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Stack } from "expo-router";
import { useLoginForm } from "../components/Login/hooks/useLoginForm";
import { useLoginHandlers } from "../components/hooks/useLoginHandlers";
import LoginHeader from "../components/Login/LoginHeader";
import EmailInput from "../components/Login/EmailInput";
import PasswordInput from "../components/Login/PasswordInput";
import SubmitButton from "../components/Login/SubmitButton";
import LoginFooter from "../components/Login/LoginFooter";
import SocialButtons from "../components/Login/SocialButtons";


export default function Login() {
  const form = useLoginForm();
  const { handleLogin, handleGoogleLogin, handleAppleLogin, loading } =
    useLoginHandlers(form.email, form.password);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Stack.Screen
        options={{ headerShown: false }}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 24 }}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={30}
      >
        <LoginHeader />
        <EmailInput
          value={form.email}
          onChangeText={form.setEmail}
          focused={form.focused}
          setFocused={form.setFocused}
          onSubmitEditing={() => form.passwordRef.current?.focus()}
        />
        <PasswordInput
          value={form.password}
          onChangeText={form.setPassword}
          inputRef={form.passwordRef}
        />
        <SubmitButton onPress={handleLogin} loading={loading} label="Iniciar sesión" />
        <SocialButtons onGoogle={handleGoogleLogin} onApple={handleAppleLogin} />
        <LoginFooter />
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
}
