import { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, Modal, Dimensions } from "react-native";
import { ChevronDown, Check } from "lucide-react-native";

export default function CuentaSelect({ options, value, onChange, placeholder = "Selecciona una cuenta" }) {
  const [open, setOpen] = useState(false);
  const selected = value || null;

  // Ancho dinámico según pantalla
  const { width } = Dimensions.get("window");
  const containerWidth = width * 0.75; // 90% del ancho de la pantalla

  return (
    <View style={{ width: containerWidth }}>
      {/* Botón principal */}
      <TouchableOpacity
        onPress={() => setOpen(true)}
        className="flex-row items-center justify-between border border-black rounded-lg px-3 py-3 bg-white"
      >
        {selected ? (
          <View className="flex-row items-center gap-2 flex-1">
            {selected.bank_logo && (
              <Image source={{ uri: selected.bank_logo }} className="w-6 h-6" resizeMode="contain" />
            )}
            <View className="flex-1">
              <Text className="font-semibold text-black">{selected.bank_name}</Text>
              <Text className="text-gray-500 text-xs">{selected.account_number}</Text>
            </View>
          </View>
        ) : (
          <Text className="text-gray-400">{placeholder}</Text>
        )}
        <ChevronDown size={18} color="black" />
      </TouchableOpacity>

      {/* Modal con lista */}
      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/40 justify-center items-center"
          onPress={() => setOpen(false)}
        >
          <View style={{ width: containerWidth }} className="bg-white max-h-80 rounded-lg p-2">
            <FlatList
              data={options}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`flex-row items-center gap-2 px-3 py-2 rounded ${
                    selected?.id === item.id ? "bg-gray-200" : ""
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
                    <Text className="font-semibold text-black">{item.bank_name}</Text>
                    <Text className="text-gray-500 text-xs">{item.account_number}</Text>
                  </View>
                  {selected?.id === item.id && <Check size={16} color="black" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
