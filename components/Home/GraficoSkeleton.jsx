import { View } from "react-native";
import Bone from "./Bone";

export default function GraficoSkeleton() {
  return (
    <View className="mt-8 bg-background rounded-3xl border border-border p-4">
      <View className="flex-row w-full mt-4 gap-3">
        <Bone className="flex-1 h-16" />
        <Bone className="flex-1 h-16" />
      </View>

      <View className="flex-row justify-center gap-6 mt-3">
        <Bone className="w-20 h-4 rounded-full" />
        <Bone className="w-20 h-4 rounded-full" />
      </View>

      <View className="w-full mb-4 mt-3 gap-2">
        <Bone className="w-24 h-3 rounded-md" />
        <Bone className="w-40 h-5 rounded-md" />
      </View>

      <Bone className="w-full h-56 rounded-2xl" />
    </View>
  );
}
