import { View } from "react-native";
import Bone from "../Home/Bone";

export default function CuentasSkeleton() {
  return (
    <View style={{ padding: 16 }}>
      <Bone className="rounded-2xl h-40 mb-6" />
      <Bone className="rounded-2xl h-14 mb-6" />
      <Bone className="w-44 h-5 rounded-md mb-3" />
      <Bone className="rounded-xl h-14 mb-6" />
      <Bone className="w-44 h-5 rounded-md mb-3" />
      <Bone className="rounded-xl h-14" />
    </View>
  );
}
