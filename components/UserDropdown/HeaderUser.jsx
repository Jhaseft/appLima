import { useState } from "react";
import { Pressable, Alert } from "react-native";
import { Stack } from "expo-router";
import { Feather } from "@expo/vector-icons"; // <--- reemplazo
import { useUser } from "../ContextUser/UserContext";
import UserMenuModal from "../UserDropdown/UserMenuModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function HeaderUser({ title }) {
  const { user, setUser, loading } = useUser();
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      await fetch("https://panel.transfercash.click/api/logoutapp", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      setUser(null);

      router.replace("/"); // redirige al login
    } catch (err) {
      console.log("Error en logout:", err);
      Alert.alert("Error", "No se pudo cerrar la sesión");
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: loading ? "Cargando..." : title,
          headerTitleAlign: "center",
          headerTintColor: "black",
          headerStyle: { backgroundColor: "white" },
          headerBackVisible: false,
          gestureEnabled: false,
          headerRight: () => (
            <Pressable
              onPress={() => !loading && setMenuVisible(true)}
              className="w-10 h-10 border-2 border-black rounded-full items-center justify-center"
            >
              <Feather
                name="user" // <--- reemplazo
                size={20}
                color={loading ? "gray" : "black"}
              />
            </Pressable>
          ),
        }}
      />

      <UserMenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        user={user}
        onLogout={handleLogout}
        onViewOperations={() => {
          Alert.alert(
            "Operaciones",
            "Aquí podrías redirigir a la pantalla de operaciones"
          );
          setMenuVisible(false);
        }}
      />
    </>
  );
}
