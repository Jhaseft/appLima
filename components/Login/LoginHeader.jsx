import { View, Text, Image } from "react-native";

export default function LoginHeader() {
  return (
    <View className="items-center mb-8">
      <Image
        source={require("../../assets/images/Logo_web_03.png")}
        className="w-96 h-28 mb-6"
        resizeMode="contain"
      />
      <Text className="text-4xl font-lm-bold text-text">Bienvenido</Text>
    </View>
  );
}
