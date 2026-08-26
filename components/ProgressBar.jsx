import { useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Check } from "lucide-react-native";
import { colors } from "../theme/colors";

function StepRow({ item, index, current, last, bottomInset }) {
  const done = index < current - 1;
  const active = index === current - 1;

  return (
    <View className="flex-row" >
      <View className="items-center mr-4 ">
        <View
          className={`w-8 h-8 rounded-full  items-center justify-center border-2 ${
            done
              ? "bg-success border-success"
              : active
              ? "bg-primary border-primary"
              : "bg-white border-gray-300"
          }`}
        >
          {done ? <Check size={18} color={colors.background} strokeWidth={3.5} /> : null}
        </View>
        {last ? null : (
          <View className={`w-0.5 flex-1 my-1 ${done ? "bg-success" : "bg-gray-200"}`} />
        )}
      </View>

      <View className={`flex-1  ${last ? "" : "pb-6"}`}>
        <Text className="text-lg font-lm-bold text-text">{item.title}</Text>
        <Text className="text-text-muted font-sans mt-1">{item.desc}</Text>
      </View>
    </View>
  );
}

export default function ProgressBar({ steps, current }) {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const progress = (current / steps.length) * 100;

  return (
    <>
      <Pressable onPress={() => setOpen(true)} hitSlop={12} className="mx-6 ">
        <View className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <View className="h-2 bg-primary rounded-full" style={{ width: `${progress}%` }} />
        </View>
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable className="flex-1 bg-black/40 justify-end" onPress={() => setOpen(false)}>
          <Pressable
            className="bg-white rounded-t-3xl px-6 pt-6"
            style={{ paddingBottom: insets.bottom + 16 }}
            onPress={() => {}}
          >
            <View className="w-12 h-1.5 rounded-full bg-gray-200 self-center mb-5" />
            <Text className="text-2xl font-lm-bold text-text">¡A pocos pasos!</Text>
            <Text className="text-text-muted font-sans mt-2 mb-6">
              Completa estos pasos para crear tu cuenta.
            </Text>

            {steps.map((item, index) => (
              <StepRow
                key={item.title}
                item={item}
                index={index}
                current={current}
                last={index === steps.length - 1}
                bottomInset={insets.bottom}
              />
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
