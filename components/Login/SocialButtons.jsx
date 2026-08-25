import { View, Text, Image, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const GOOGLE_LOGO = "https://developers.google.com/identity/images/g-logo.png";

function IconButton({ onPress, children }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-20 h-14 items-center justify-center border-2 border-gray-200 rounded-2xl bg-white active:opacity-80"
    >
      {children}
    </TouchableOpacity>
  );
}

export default function SocialButtons({ onGoogle, onApple }) {
  return (
    <View>
      <View className="flex-row items-center my-4">
        <View className="flex-1 h-px bg-gray-200" />
        <Text className="mx-3 text-text-muted text-sm font-sans">o</Text>
        <View className="flex-1 h-px bg-gray-200" />
      </View>

      <View className="flex-row justify-center gap-4">
        {Platform.OS === "ios" && (
          <IconButton onPress={onApple}>
            <Ionicons name="logo-apple" size={28} color="#000" />
          </IconButton>
        )}
        <IconButton onPress={onGoogle}>
          <Image source={{ uri: GOOGLE_LOGO }} style={{ width: 24, height: 24 }} resizeMode="contain" />
        </IconButton>
      </View>
    </View>
  );
}
