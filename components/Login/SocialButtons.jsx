import { View, Text, Image, TouchableOpacity, Platform } from "react-native";
import { Apple } from "lucide-react-native";
import { colors } from "../../theme/colors";

const GOOGLE_LOGO = "https://developers.google.com/identity/images/g-logo.png";

function IconButton({ onPress, children }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-20 h-14 items-center justify-center border-2 border-border rounded-2xl bg-background active:opacity-80"
    >
      {children}
    </TouchableOpacity>
  );
}

export default function SocialButtons({ onGoogle, onApple }) {
  return (
    <View>
      <View className="flex-row items-center my-4">
        <View className="flex-1 h-px bg-border" />
        <Text className="mx-3 text-text-muted text-sm font-sans">o</Text>
        <View className="flex-1 h-px bg-border" />
      </View>

      <View className="flex-row justify-center gap-4">
        {Platform.OS === "ios" && (
          <IconButton onPress={onApple}>
            <Apple size={28} color={colors.text} fill={colors.text} />
          </IconButton>
        )}
        <IconButton onPress={onGoogle}>
          <Image source={{ uri: GOOGLE_LOGO }} style={{ width: 24, height: 24 }} resizeMode="contain" />
        </IconButton>
      </View>
    </View>
  );
}
