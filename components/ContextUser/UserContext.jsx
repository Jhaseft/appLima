import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  // Obtiene usuario
  const fetchUser = async (initialUser = null) => {
    setLoading(true);
    try {
      if (initialUser) {
        setUser(initialUser);
        await AsyncStorage.setItem("user", JSON.stringify(initialUser));
        return initialUser;
      }

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setUser(null);
        return null;
      }

      const res = await fetch("https://panel.transfercash.click/api/userapp", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok && data?.id) {
        setUser(data);
        await AsyncStorage.setItem("user", JSON.stringify(data));
        return data;
      } else {
        setUser(null);
        await AsyncStorage.removeItem("user");
        return null;
      }
    } catch {
      setUser(null);
      await AsyncStorage.removeItem("user");
      return null;
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
