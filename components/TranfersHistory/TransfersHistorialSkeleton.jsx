import { View } from "react-native";
import Bone from "../Home/Bone";

function CardSkeleton() {
  return (
    <View className="bg-background p-5 rounded-2xl border border-border mb-5 gap-3">
      <View className="flex-row justify-between items-center">
        <Bone className="w-14 h-5 rounded-md" />
        <Bone className="w-24 h-4 rounded-md" />
        <Bone className="w-20 h-5 rounded-full" />
      </View>
      <Bone className="h-24 rounded-lg" />
      <Bone className="h-16 rounded-lg" />
    </View>
  );
}

export default function TransfersHistorialSkeleton() {
  return (
    <View className="px-4 pt-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </View>
  );
}
