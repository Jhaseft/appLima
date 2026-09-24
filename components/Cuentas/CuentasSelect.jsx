import { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, Modal, Dimensions } from "react-native";
import { ChevronDown, Check } from "lucide-react-native";
import { colors } from "../../theme/colors";

export default function CuentaSelect({ options, value, onChange, placeholder = "Selecciona una cuenta" }) {
  const [open, setOpen] = useState(false);
  const selected = value || null;

  const { width } = Dimensions.get("window");
  const containerWidth = width * 0.62;

  return (
    <View style={{ width: containerWidth }}>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        className="flex-row items-center justify-between border border-border rounded-lg px-3 py-3 bg-background"
      >
        {selected ? (
          <View className="flex-row items-center gap-2 flex-1">
            {selected.bank_logo && (
              <Image source={{ uri: selected.bank_logo }} className="w-6 h-6" resizeMode="contain" />
            )}
            <View className="flex-1">
              <Text className="font-lm-medium text-text">{selected.bank_name}</Text>
              <Text className="text-text-muted text-xs">{selected.account_number}</Text>
            </View>
          </View>
        ) : (
          <Text className="text-text-muted">{placeholder}</Text>
        )}
        <ChevronDown size={18} color={colors.text} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/40 justify-center items-center"
          onPress={() => setOpen(false)}
        >
          <View style={{ width: containerWidth }} className="bg-background max-h-80 rounded-lg p-2">
            <FlatList
              data={options}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`flex-row items-center gap-2 px-3 py-2 rounded ${
                    selected?.id === item.id ? "bg-primary-light" : ""
                  }`}
                  onPress={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                >
                  {item.bank_logo && (
                    <Image source={{ uri: item.bank_logo }} className="w-6 h-6" resizeMode="contain" />
                  )}
                  <View className="flex-1">
                    <Text className="font-lm-medium text-text">{item.bank_name}</Text>
                    <Text className="text-text-muted text-xs">{item.account_number}</Text>
                  </View>
                  {selected?.id === item.id && <Check size={16} color={colors.text} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
