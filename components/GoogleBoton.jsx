import { Text, Image, View, TouchableOpacity } from "react-native";

const GOOGLE_LOGO = "https://developers.google.com/identity/images/g-logo.png";

export default function GoogleBotoon({ handleGoogleLogin }) {
  return (
    <>
      <View className="flex-row items-center my-4">
        <View className="flex-1 h-px bg-gray-200" />
        <Text className="mx-3 text-text-muted text-sm font-sans">o</Text>
        <View className="flex-1 h-px bg-gray-200" />
      </View>

      <TouchableOpacity
        onPress={handleGoogleLogin}
        className="flex-row items-center justify-center border-2 border-gray-200 rounded-2xl py-4 bg-white active:opacity-80"
      >
        <Image
          source={{ uri: GOOGLE_LOGO }}
          style={{ width: 20, height: 20, marginRight: 10 }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </>
  );
}
