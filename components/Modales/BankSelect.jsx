import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { ChevronDown, Check } from "lucide-react-native";

const PAISES = [
  { key: "bolivia", label: "Bolivia", flag: "🇧🇴" },
  { key: "peru", label: "Perú", flag: "🇵🇪" },
];

export default function BankSelect({ options, value, onChange, placeholder = "Seleccionar banco", loading = false }) {
  const [open, setOpen] = useState(false);
  const [paisSeleccionado, setPaisSeleccionado] = useState(null);
  const selected = value || null;

  const bancosFiltrados = paisSeleccionado
    ? options.filter((o) => o.country?.toLowerCase() === paisSeleccionado)
    : [];

  const handlePaisChange = (pais) => {
    if (pais === paisSeleccionado) return;
    setPaisSeleccionado(pais);
    onChange(null); // reset banco al cambiar país
    setOpen(false);
  };

  return (
    <View className="w-full mb-2">
      
      <Text className="text-xs font-semibold text-gray-400 uppercase mb-2">
        ¿A qué país vas a enviar?
      </Text>
      
      <View className="flex-row gap-2 mb-4">
        {PAISES.map((p) => {
          const activo = paisSeleccionado === p.key;
          return (
            <TouchableOpacity
              key={p.key}
              onPress={() => handlePaisChange(p.key)}
              className={`flex-1 py-3 rounded-xl border items-center ${
                activo ? "bg-black border-black" : "bg-white border-gray-200"
              }`}
            >
              <Text className="text-lg mb-0.5">{p.flag}</Text>
              <Text
                className={`font-semibold text-sm ${
                  activo ? "text-white" : "text-gray-600"
                }`}
              >
                {p.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

     
      {paisSeleccionado && (
        <View className="relative">
          <TouchableOpacity
            onPress={() => setOpen(!open)}
            className="w-full flex-row items-center justify-between border rounded-xl px-4 py-3 bg-white shadow-sm"
          >
            {selected ? (
              <View className="flex-row items-center gap-3">
                {selected.logo_url && (
                  <Image
                    source={{ uri: selected.logo_url }}
                    className="w-6 h-6 object-contain"
                  />
                )}
                <Text className="text-gray-800 font-medium">{selected.name}</Text>
              </View>
            ) : (
              <Text className="text-gray-400">{placeholder}</Text>
            )}
            <ChevronDown size={20} color="#6b7280" />
          </TouchableOpacity>

          {open && (
            <View
              className="absolute w-full bg-white border rounded-xl shadow-lg max-h-60 z-50"
              style={{ top: "105%" }}
            >
              <ScrollView nestedScrollEnabled={true}>
                {loading ? (
                  <View className="px-4 py-3 items-center justify-center">
                    <Text className="text-gray-500">Cargando bancos...</Text>
                  </View>
                ) : bancosFiltrados.length === 0 ? (
                  <View className="px-4 py-3 items-center justify-center">
                    <Text className="text-gray-400 text-sm">
                      No hay bancos disponibles
                    </Text>
                  </View>
                ) : (
                  bancosFiltrados.map((opt) => (
                    <TouchableOpacity
                      key={opt.id}
                      onPress={() => {
                        onChange(opt);
                        setOpen(false);
                      }}
                      className={`w-full flex-row items-center px-4 py-3 rounded-lg ${
                        selected?.id === opt.id ? "bg-blue-50" : ""
                      }`}
                    >
                      {opt.logo_url && (
                        <Image
                          source={{ uri: opt.logo_url }}
                          className="w-8 h-8 mr-3"
                        />
                      )}
                      <Text className="text-gray-800 font-medium flex-1">
                        {opt.name}
                      </Text>
                      {selected?.id === opt.id && (
                        <Check size={18} color="#3b82f6" />
                      )}
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
