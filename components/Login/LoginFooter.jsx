import { View, Text, TouchableOpacity, Linking } from "react-native";
import { Link } from "expo-router";

export default function LoginFooter() {
  return (
    <View>
      <View className="mt-4 flex-row justify-center">
        <TouchableOpacity
          onPress={() => Linking.openURL("https://transfercash.click/forgot-password")}
        >
          <Text className="text-primary-dark font-lm-medium">Olvidé mi contraseña</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-6 flex-row justify-center">
        <Text className="text-text mr-1 font-sans">¿No tienes cuenta?</Text>
        <Link asChild href="/Register">
          <Text className="text-primary-dark font-lm-medium">Regístrate aquí</Text>
        </Link>
      </View>
    </View>
  );
}
