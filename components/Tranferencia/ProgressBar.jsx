import { View, Text } from "react-native";
import { Check } from "lucide-react-native";

export default function ProgressBar({ step }) {
  const steps = [
    "Cotiza",
    "Seleccion de Cuentas",
    "Transfiere",
    "Adjunta y finaliza operacion",
  ];

  return (
    <View className="w-full my-5">
      {/* Fila superior: bolitas + líneas */}
      <View className="flex-row items-center justify-between w-full px-3">
        {steps.map((_, index) => {
          const current = index + 1;
          const isCompleted = step > current;
          const isActive = step === current;

          return (
            <View key={index} className="flex-1 items-center">
              {/* Círculo */}
              <View
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center z-10
                ${isCompleted || isActive ? "bg-blue-500 border-blue-500" : "bg-gray-200 border-gray-300"}`}
              >
                {isCompleted ? (
                  <Check size={18} color="white" strokeWidth={3} />
                ) : (
                  <Text
                    className={`${
                      isActive ? "text-white" : "text-gray-500"
                    } font-bold text-sm`}
                  >
                    
                  </Text>
                )}
              </View>

              {/* Línea hacia la derecha (excepto última) */}
              {index < steps.length - 1 && (
                <View
                  className={`absolute top-1/2 left-1/2 h-1 w-full -z-10
                  ${step > current ? "bg-blue-500" : "bg-gray-300"}`}
                />
              )}
            </View>
          );
        })}
      </View>

      {/* Fila inferior: etiquetas */}
      <View className="flex-row justify-between mt-2 px-2">
        {steps.map((label, index) => (
          <View key={index} className="flex-1 items-center px-1">
            <Text className="text-xs text-center">{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
