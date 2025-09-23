
import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Network from "expo-network";
import { Alert, BackHandler } from "react-native";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  const checkConnection = async () => {
    try {
      const status = await Network.getNetworkStateAsync();
      if (!status.isConnected) {
        Alert.alert(
          "Sin conexión a Internet",
          "Necesitas estar conectado a internet para usar Transfer Cash.",
          [{ text: "Aceptar", onPress: () => BackHandler.exitApp() }],
          { cancelable: false }
        );
        return false;
      }
      return true;
    } catch (err) {
      console.log("Error revisando conexión:", err);
      return false;
    }
  };

  const fetchUser = async (initialUser = null) => {
  setLoading(true);
  try {
    // 1️⃣ Si viene usuario del login
    if (initialUser) {
      setUser(initialUser);
      await AsyncStorage.setItem("user", JSON.stringify(initialUser));
      setLoading(false);
      return;
    }

    // 2️⃣ Intentar cargar usuario desde AsyncStorage primero
    const storedUser = await AsyncStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
      return;
    }

    // 3️⃣ Si no hay usuario, hacemos fetch desde token
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const hasInternet = await checkConnection();
    if (!hasInternet) {
      setUser(null);
      setLoading(false);
      return;
    }

    const res = await fetch("https://panel.transfercash.click/api/userapp", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("No autorizado");

    const data = await res.json();
    if (data && data.user) {
      setUser(data.user);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
    } else {
      setUser(null);
      await AsyncStorage.removeItem("user");
    }
  } catch (err) {
    console.log("Error obteniendo usuario:", err);
    setUser(null);
    await AsyncStorage.removeItem("user");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
