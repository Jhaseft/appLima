import { View, Text, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { colors } from "../../theme/colors";

export default function ChatHeader() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top }} className="bg-background border-b border-border">
      <View className="flex-row items-center gap-3 px-4 h-14">
        <Pressable onPress={() => router.replace("/Home")} className="p-1" hitSlop={8}>
          <ArrowLeft size={24} color={colors.text} />
        </Pressable>

        <View className="w-10 h-10 rounded-full overflow-hidden bg-primary border-2 border-primary">
          <Image
            source={require("../../assets/images/logopro2.png")}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        </View>
        <View>
          <Text className="text-text text-base font-lm-bold leading-tight">Asistente TC</Text>
          <Text className="text-success text-xs font-lm-medium">en línea</Text>
        </View>
      </View>
    </View>
  );
}
