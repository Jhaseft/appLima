import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { ChevronDown, Check } from "lucide-react-native";

export default function BankSelect({ options, value, onChange, placeholder = "Seleccionar banco", loading = false }) {
  const [open, setOpen] = useState(false);
  const selected = value || null;

  return (
    <View className="w-full mb-4 relative">
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        className="w-full flex-row items-center justify-between border rounded-xl px-4 py-3 bg-white shadow-sm"
      >
        {selected ? (
          <View className="flex-row items-center gap-3">
            {selected.logo_url && (
              <Image source={{ uri: selected.logo_url }} className="w-6 h-6 object-contain" />
            )}
            <Text className="text-gray-800 font-medium">{selected.name}</Text>
          </View>
        ) : (
          <Text className="text-gray-400">{placeholder}</Text>
        )}
        <ChevronDown size={20} color="#6b7280" />
      </TouchableOpacity>

      {open && (
        <View className="absolute mt-2 w-full bg-white border rounded-xl shadow-lg max-h-60 z-50">
          <ScrollView nestedScrollEnabled={true}>
            {loading ? (
              <View className="px-4 py-3 flex-row items-center justify-center">
                <Text className="text-gray-500">Cargando bancos...</Text>
              </View>
            ) : (
              options.map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  onPress={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`w-full flex-row items-center px-4 py-3 rounded-lg ${
                    selected?.id === opt.id ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
                >
                  {opt.logo_url && <Image source={{ uri: opt.logo_url }} className="w-8 h-8 mr-3" />}
                  <View className="flex-1 flex-row justify-between items-center">
                    <Text className="text-gray-800 font-medium">{opt.name}</Text>
                    <View className="px-2 py-0.5 rounded-full bg-gray-100 border">
                      <Text className="text-gray-500 text-xs capitalize">{opt.country}</Text>
                    </View>
                  </View>
                  {selected?.id === opt.id && <Check size={18} color="#3b82f6" />}
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
