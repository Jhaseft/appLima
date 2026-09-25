import { View } from "react-native";
import Bone from "../Home/Bone";

export default function CotizaSkeleton() {
  return (
    <View className="flex-1 items-center px-12 pt-8">
      <Bone className="w-48 h-7 rounded-md mb-2" />
      <Bone className="w-64 h-4 rounded-md mb-6" />

      <View className="flex-row justify-between w-full mb-4">
        <Bone className="w-24 h-5 rounded-md" />
        <Bone className="w-24 h-5 rounded-md" />
      </View>

      <View className="w-full gap-3 p-6 rounded-xl border border-border">
        <Bone className="w-28 h-4 rounded-md self-center" />
        <Bone className="w-full h-11 rounded-lg" />
        <Bone className="w-11 h-11 rounded-full self-center" />
        <Bone className="w-28 h-4 rounded-md self-center" />
        <Bone className="w-full h-11 rounded-lg" />
        <Bone className="w-full h-11 rounded-lg mt-2" />
      </View>
    </View>
  );
}
