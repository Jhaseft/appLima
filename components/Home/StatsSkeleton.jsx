import { View } from "react-native";
import Bone from "./Bone";

export default function StatsSkeleton({ cardW, gap }) {
  return (
    <View className="flex-row" style={{ gap }}>
      <Bone className="rounded-3xl h-28" style={{ width: cardW }} />
      <Bone className="rounded-3xl h-28" style={{ width: cardW }} />
    </View>
  );
}
