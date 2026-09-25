import { View, Text } from "react-native";
import { Check } from "lucide-react-native";
import { colors } from "../../theme/colors";

const STEPS = ["Cotiza", "Operación", "Transfiere", "Adjunta y finaliza"];

export default function ProgressBar({ step }) {
  return (
    <View className="w-full mt-5">
      <View className="flex-row items-center justify-between w-full px-3">
        {STEPS.map((_, index) => {
          const current = index + 1;
          const isCompleted = step > current;
          const isActive = step === current;

          return (
            <View key={index} className="flex-1 items-center">
              <View
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center z-10 ${
                  isCompleted || isActive ? "bg-primary-accent border-primary-light" : "bg-border border-border"
                }`}
              >
                {isCompleted ? (
                  <Check size={18} color={colors.background} strokeWidth={3} />
                ) : (
                  <Text className={`${isActive ? "text-background" : "text-text-muted"} font-lm-bold text-sm`}>
                    {current}
                  </Text>
                )}
              </View>

              {index < STEPS.length - 1 && (
                <View className={`absolute top-1/2 left-1/2 h-1 w-full -z-10 ${step > current ? "bg-primary-accent" : "bg-border"}`} />
              )}
            </View>
          );
        })}
      </View>

      <View className="flex-row justify-between mt-2 px-2">
        {STEPS.map((label, index) => (
          <View key={index} className="flex-1 items-center px-1">
            <Text className="text-xs text-center text-text font-sans">{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
