import { View, Text, TextInput, Pressable, Linking } from "react-native";
import { Mail } from "lucide-react-native";
import { colors } from "../../theme/colors";
import API_BASE_URL from "../api";
import SocialButtons from "../Login/SocialButtons";

export default function StepEmail({ email, setEmail, valid, onContinue, onGoogle, onApple }) {
  return (
    <View>
      <Text className="text-3xl font-lm-bold text-text mb-8">Crear una cuenta</Text>

      <Text className="text-text font-lm-medium mb-2">Ingresa tu correo</Text>
      <View className="flex-row items-center border-2 border-gray-300 rounded-2xl px-4 bg-white">
        <Mail size={20} color={colors.textMuted} />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="ejemplo@gmail.com"
          placeholderTextColor={colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          className="flex-1 py-4 ml-3 text-text font-sans text-base"
        />
      </View>

      <Text className="text-text-muted font-sans text-sm mt-4">
        Al crear una cuenta aceptas nuestros{" "}
        <Text
          className="text-primary-dark font-lm-medium"
          onPress={() => Linking.openURL(`${API_BASE_URL}/politicas`)}
        >
          Términos y Política de Privacidad
        </Text>
        .
      </Text>

      <Pressable
        onPress={onContinue}
        disabled={!valid}
        className={`w-full py-4 rounded-2xl mt-8 bg-primary ${
          valid ? "active:opacity-80" : "opacity-50"
        }`}
      >
        <Text className="text-center text-text font-lm-bold text-lg">Continuar</Text>
      </Pressable>

      <SocialButtons onGoogle={onGoogle} onApple={onApple} />
    </View>
  );
}
