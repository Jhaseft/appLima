import { View, Text } from "react-native";

export default function ProgressBar({ step, totalSteps }) {
  const progress = (step / totalSteps) * 100;
  const stepsLabels = ["Personal", "Extra", "Seguridad"];
  
  return (
    <View className="mb-6">
      <View className="h-2 w-full bg-gray-300 rounded-full overflow-hidden">
        <View className="h-2 bg-black rounded-full" style={{ width: `${progress}%` }} />
      </View>
      <View className="flex-row justify-between mt-4">
        {stepsLabels.map((label, index) => (
          <View key={index} className="items-center">
            <View className={`w-6 h-6 rounded-full border-2 mb-1 ${step - 1 >= index ? "bg-black" : "bg-white border-gray-400"}`} />
            <Text className="text-xs text-center">{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
