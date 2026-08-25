import { View, Text, Modal, FlatList, TouchableOpacity, Image } from "react-native";

export default function SelectModal({ visible, onClose, items, onSelect }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white w-3/4 max-h-80 rounded-xl overflow-hidden">
          <FlatList
            data={items}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex-row items-center px-4 py-3"
                onPress={() => onSelect(item)}
              >
                {item.flag ? (
                  <Image
                    source={{ uri: item.flag }}
                    className="w-6 h-4 mr-2 rounded border border-gray-200"
                  />
                ) : null}
                <Text className="text-text font-sans">
                  {item.label}
                  {item.value?.startsWith("+") ? ` (${item.value})` : ""}
                </Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            className="p-3 items-center border-t border-gray-200"
            onPress={onClose}
          >
            <Text className="text-primary-dark font-lm-medium">Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
