import { View } from "react-native";
import Bone from "../Home/Bone";

function Fila() {
  return (
    <View className="flex-row items-center px-4 py-4 border-b border-border">
      <Bone className="w-10 h-10 rounded-full mr-3" />
      <View className="flex-1 gap-2">
        <Bone className="h-4 w-3/4 rounded-md" />
        <Bone className="h-3 w-24 rounded-md" />
      </View>
      <Bone className="h-4 w-16 rounded-md ml-3" />
    </View>
  );
}

export default function HistorialSkeleton() {
  return (
    <View className="flex-1 bg-background">
      {Array.from({ length: 8 }).map((_, i) => (
        <Fila key={i} />
      ))}
    </View>
  );
}
