import { View, TouchableOpacity, Text } from "react-native";

export default function StepNavigation({ step, loading, canSubmit, onPrev, onNext, onSubmit }) {
  const isLast = step === 3;
  const disabled = loading || (!canSubmit && isLast);

  return (
    <View className="flex-row justify-between mt-6">
      {step > 1 ? (
        <TouchableOpacity
          onPress={onPrev}
          className="border-2 border-primary py-3 px-6 rounded-xl active:opacity-70"
        >
          <Text className="text-text font-lm-bold">Anterior</Text>
        </TouchableOpacity>
      ) : (
        <View />
      )}

      <TouchableOpacity
        onPress={isLast ? onSubmit : onNext}
        disabled={disabled}
        className={`py-3 px-6 rounded-xl bg-primary ${disabled ? "opacity-50" : "active:opacity-80"}`}
      >
        <Text className="text-text font-lm-bold">
          {loading ? "Procesando..." : isLast ? "Finalizar" : "Siguiente"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
