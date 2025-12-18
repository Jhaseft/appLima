import { View, Text, Pressable, Modal, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons"; // <--- reemplazo

export default function UserMenuModal({ visible, onClose, user, onLogout, onViewOperations }) {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" }}
        activeOpacity={1}
        onPressOut={onClose}
      >
        <View
          style={{
            position: "absolute",
            top: 60,
            right: 20,
            backgroundColor: "white",
            padding: 16,
            borderRadius: 12,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          {user ? (
            <>
              <Text className="text-black font-bold mb-2">👤 {user.first_name}</Text>
              <Text className="text-black mb-4">📧 {user.email}</Text>

              
              <Pressable
                onPress={onViewOperations}
                className="flex-row items-center border border-black px-4 gap-2 py-2 rounded-2xl mb-2"
              >
                <Feather name="settings" size={20} color="black" style={{ marginRight: 8 }} />
                <Text className="text-black font-bold">Ver operaciones</Text>
              </Pressable>

              {/* Cerrar sesión */}
              <Pressable
                onPress={onLogout}
                className="flex-row border border-black px-4 py-2 gap-2 rounded-2xl"
              >
                <Feather name="log-out" size={20} color="black" style={{ marginRight: 8 }} />
                <Text className="text-black font-bold">Cerrar sesión</Text>
              </Pressable>
            </>
          ) : (
            <Text className="text-black">Cargando información...</Text>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
