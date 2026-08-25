import AsyncStorage from "@react-native-async-storage/async-storage";

export const getToken = () => AsyncStorage.getItem("token");
