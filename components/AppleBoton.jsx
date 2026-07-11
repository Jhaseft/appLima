import { Platform, View } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";

export default function AppleBoton({ handleAppleLogin }) {
  // Sign in with Apple solo existe en iOS.
  if (Platform.OS !== "ios") return null;

  return (
    <View className="mt-3">
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={16}
        style={{ width: "100%", height: 56 }}
        onPress={handleAppleLogin}
      />
    </View>
  );
}
