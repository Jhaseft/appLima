import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";

export default function AuthActions() {
  return (
    <View className="mb-2">
      <Text className="text-text text-center font-lm-medium text-lg">
        Para iniciar tu operación
      </Text>

      <Link asChild href="/Register">
        <Pressable className="mt-4 border-2 border-primary py-4 rounded-2xl active:opacity-70">
          <Text className="text-text text-center font-lm-bold text-lg">
            ¡Regístrate!
          </Text>
        </Pressable>
      </Link>

      <Link asChild href="/Login">
        <Pressable className="bg-primary py-4 mt-4 rounded-2xl active:opacity-80 shadow">
          <Text className="text-text text-center font-lm-bold text-lg">
            Iniciar Sesión
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}
