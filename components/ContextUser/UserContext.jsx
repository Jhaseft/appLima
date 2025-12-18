import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../api";
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //  Cargar usuario guardado (rápido, sin backend)
  const loadUserFromStorage = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log("Error cargando usuario local", error);
    }
  };

  const fetchUser = async (initialUser = null) => {
  console.log("🟡 fetchUser iniciado");

  try {
    if (initialUser) {
      console.log("🟢 Usuario recibido desde login:", initialUser);
      setUser(initialUser);
      await AsyncStorage.setItem("user", JSON.stringify(initialUser));
      return initialUser;
    }

    const token = await AsyncStorage.getItem("token");
    console.log("🔐 Token obtenido:", token);

    if (!token) {
      console.log("🔴 No hay token, cerrando sesión");
      setUser(null);
      await AsyncStorage.removeItem("user");
      return null;
    }

    console.log("➡️ Enviando request a /api/userapp");

    const res = await fetch(`${API_BASE_URL}/api/userapp`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    console.log("⬅️ Status HTTP:", res.status);
    console.log("⬅️ Headers:", Object.fromEntries(res.headers.entries()));

    const text = await res.text();
    console.log("📦 Respuesta cruda del backend:\n", text);

    let data;
    try {
      data = JSON.parse(text);
      console.log("✅ JSON parseado correctamente:", data);
    } catch (e) {
      console.log("❌ ERROR: la respuesta NO es JSON");
      throw new Error("Respuesta no JSON");
    }

    if (res.ok && data?.id) {
      console.log("🟢 Usuario válido, guardando en estado y storage");
      setUser(data);
      await AsyncStorage.setItem("user", JSON.stringify(data));
      return data;
    } else {
      console.log("🔴 Respuesta inválida o usuario sin ID");
      setUser(null);
      await AsyncStorage.multiRemove(["token", "user"]);
      return null;
    }
  } catch (error) {
    console.log("💥 Error sincronizando usuario:", error.message);
    setUser(null);
    await AsyncStorage.multiRemove(["token", "user"]);
    return null;
  }
};

  //  Inicialización correcta
  useEffect(() => {
    const init = async () => {
      await loadUserFromStorage(); // muestra user inmediato
      await fetchUser();           // valida token
      setLoading(false);
    };

    init();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        fetchUser,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
