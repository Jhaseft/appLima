import { View, Linking } from "react-native";
import { useRouter } from "expo-router";
import { HOME_BUTTONS } from "./data/homeButtons";
import BotonItem from "./BotonItem";

export default function Botons() {
  const router = useRouter();

  const navigateTo = (btn) => {
    if (btn.whatsappNumber) {
      const url = `https://wa.me/${btn.whatsappNumber}?text=${encodeURIComponent(
        btn.whatsappMessage
      )}`;
      Linking.openURL(url);
      return;
    }
    router.replace(btn.route);
  };

  return (
    <View className="flex-row justify-between mt-4">
      {HOME_BUTTONS.map((btn) => (
        <BotonItem key={btn.label1} btn={btn} onPress={navigateTo} />
      ))}
    </View>
  );
}
