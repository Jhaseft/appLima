import { View } from "react-native";
import Bone from "../Home/Bone";

export default function TcPuntosSkeleton() {
  return (
    <View className="flex-1 bg-background">
      <View className="items-center pt-8 pb-6 px-6 border-b border-border">
        <View className="flex-row gap-3 mb-5">
          <Bone className="rounded-2xl h-11 w-40" />
          <Bone className="rounded-2xl h-11 w-40" />
        </View>
        <Bone className="rounded-2xl h-16 w-56 mb-3" />
        <Bone className="rounded-2xl h-7 w-44" />
      </View>

      <View className="pt-4 px-4 gap-3">
        <Bone className="rounded-2xl h-36" />
        <Bone className="rounded-2xl h-36" />
      </View>
    </View>
  );
}
