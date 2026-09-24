import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { ChevronDown, Check } from "lucide-react-native";
import { colors } from "../../theme/colors";

const PAISES = [
  { key: "bolivia", label: "Bolivia", flag: "🇧🇴" },
  { key: "peru", label: "Perú", flag: "🇵🇪" },
];

export default function BankSelect({ options, value, onChange, placeholder = "Seleccionar banco", loading = false, defaultCountry = null }) {
  const [open, setOpen] = useState(false);
  const [paisSeleccionado, setPaisSeleccionado] = useState(() => defaultCountry ?? null);
  const selected = value || null;

  const bancosFiltrados = paisSeleccionado
    ? options.filter((o) => o.country?.toLowerCase() === paisSeleccionado)
    : [];

  const handlePaisChange = (pais) => {
    if (pais === paisSeleccionado) return;
    setPaisSeleccionado(pais);
    onChange(null);
    setOpen(false);
  };

  return (
    <View className="w-full mb-2">
      {!defaultCountry && (
        <View className="flex-row gap-2 mb-4">
          {PAISES.map((p) => {
            const activo = paisSeleccionado === p.key;
            return (
              <TouchableOpacity
                key={p.key}
                onPress={() => handlePaisChange(p.key)}
                className={`flex-1 py-3 rounded-xl border items-center ${
                  activo ? "bg-primary border-primary" : "bg-background border-border"
                }`}
              >
                <Text className="text-lg mb-0.5">{p.flag}</Text>
                <Text className={`text-sm ${activo ? "font-lm-bold text-text" : "font-sans text-text-muted"}`}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {paisSeleccionado && (
        <View className="relative">
          <TouchableOpacity
            onPress={() => setOpen(!open)}
            className="w-full flex-row items-center justify-between border border-border rounded-xl px-4 py-3 bg-background shadow-sm"
          >
            {selected ? (
              <View className="flex-row items-center gap-3">
                {selected.logo_url && (
                  <Image source={{ uri: selected.logo_url }} className="w-6 h-6 object-contain" />
                )}
                <Text className="text-text font-lm-medium">{selected.name}</Text>
              </View>
            ) : (
              <Text className="text-text-muted font-sans">{placeholder}</Text>
            )}
            <ChevronDown size={20} color={colors.textMuted} />
          </TouchableOpacity>

          {open && (
            <View
              className="absolute w-full bg-background border border-border rounded-xl shadow-lg max-h-60 z-50"
              style={{ top: "105%" }}
            >
              <ScrollView nestedScrollEnabled={true}>
                {loading ? (
                  <View className="px-4 py-3 items-center justify-center">
                    <Text className="text-text-muted font-sans">Cargando bancos...</Text>
                  </View>
                ) : bancosFiltrados.length === 0 ? (
                  <View className="px-4 py-3 items-center justify-center">
                    <Text className="text-text-muted font-sans text-sm">No hay bancos disponibles</Text>
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
                        selected?.id === opt.id ? "bg-primary-light" : ""
                      }`}
                    >
                      {opt.logo_url && (
                        <Image source={{ uri: opt.logo_url }} className="w-8 h-8 mr-3" />
                      )}
                      <Text className="text-text font-lm-medium flex-1">{opt.name}</Text>
                      {selected?.id === opt.id && <Check size={18} color={colors.primaryAccent} />}
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
