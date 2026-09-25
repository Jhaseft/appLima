import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { Search } from "lucide-react-native";
import { colors } from "../../theme/colors";

export default function SearchBar({ search, onSearch, triggerSearch }) {
  return (
    <View className="bg-background flex-row items-center p-3 rounded-2xl shadow-lg border border-border mb-5 gap-2">
      <Search size={20} color={colors.textMuted} />
      <TextInput
        className="flex-1 text-text text-sm"
        placeholder="Buscar por ID de transferencia..."
        placeholderTextColor={colors.textMuted}
        keyboardType="numeric"
        returnKeyType="search"
        value={search}
        onChangeText={onSearch}
        onSubmitEditing={triggerSearch}
      />
      <TouchableOpacity onPress={triggerSearch} className="bg-text px-3 py-1.5 rounded-xl">
        <Text className="text-background text-sm font-lm-medium">Buscar</Text>
      </TouchableOpacity>
    </View>
  );
}
