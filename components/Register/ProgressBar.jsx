import { View, Text } from "react-native";

const LABELS = ["Personal", "Extra", "Seguridad"];

export default function ProgressBar({ step, totalSteps }) {
  const progress = (step / totalSteps) * 100;

  return (
    <View className="mb-6">
      <View className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <View className="h-2 bg-primary rounded-full" style={{ width: `${progress}%` }} />
      </View>
      <View className="flex-row justify-between mt-4">
        {LABELS.map((label, index) => (
          <View key={label} className="items-center">
            <View
              className={`w-6 h-6 rounded-full border-2 mb-1 ${
                step - 1 >= index ? "bg-primary border-primary" : "bg-white border-gray-300"
              }`}
            />
            <Text className="text-xs text-center text-text font-sans">{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
