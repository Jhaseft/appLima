import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../components/api";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotifications() {
  if (!Device.isDevice) return null;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") return null;

  const token = (
    await Notifications.getExpoPushTokenAsync({
      projectId: "c896182e-bb15-4c0e-96ca-1037184c0576",
    })
  ).data;

  console.log("📲 Expo Push Token:", token);
  await savePushToken(token);
  return token;
}

async function savePushToken(token) {
  try {
    const authToken = await AsyncStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/api/push-tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    console.log("✅ Token guardado en BD:", data);
  } catch (e) {
    console.log("❌ Error guardando token:", e.message);
  }
}
