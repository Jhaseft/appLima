import { useState } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_W } = Dimensions.get("window");

export default function ReceiptModal({ visible, images, title, onClose }) {
  const [currentPage, setCurrentPage] = useState(0);
  const insets = useSafeAreaInsets();


  const handleScrollEnd = (e) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
    setCurrentPage(page);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center" style={{ backgroundColor: "rgba(0,0,0,0.92)", paddingTop: insets.top, paddingBottom: insets.bottom }}>
        {/* Header */}
        <View className="flex-row justify-between items-center px-5 pt-5 pb-3">
          <Text className="text-white font-bold text-base">{title}</Text>
          <View className="flex-row items-center gap-3">
            {images.length > 1 && (
              <Text className="text-gray-400 text-sm">
                {currentPage + 1} / {images.length}
              </Text>
            )}
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 rounded-full justify-center items-center"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              <Text className="text-white text-base font-bold">✕</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Image pager */}
        <FlatList
          data={images}
          keyExtractor={(img) => String(img.id)}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScrollEnd}
          renderItem={({ item }) => (
            <View
              className="justify-center items-center px-4"
              style={{ width: SCREEN_W }}
            >
              <Image
                source={{ uri: item.receipt_url }}
                style={{
                  width: SCREEN_W - 32,
                  height: SCREEN_W * 1.1,
                  borderRadius: 12,
                }}
                resizeMode="contain"
              />
            </View>
          )}
        />

        
        {images.length > 1 && (
          <View className="flex-row justify-center gap-1.5 py-4">
            {images.map((_, i) => (
              <View
                key={i}
                style={{
                  width: i === currentPage ? 20 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor:
                    i === currentPage ? "#fff" : "rgba(255,255,255,0.35)",
                }}
              />
            ))}
          </View>
        )}

        <TouchableOpacity
          onPress={onClose}
          className="mx-6 mb-8 rounded-xl py-3.5 items-center"
          style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
        >
          <Text className="text-white font-semibold text-base">Cerrar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
