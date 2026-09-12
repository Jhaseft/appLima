import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../components/api";

export const NOTIF_PREF_KEY = "pref_notifications";
export const PUSH_TOKEN_KEY = "push_token";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    const enabled = (await AsyncStorage.getItem(NOTIF_PREF_KEY)) !== "0";
    return {
      shouldShowAlert: enabled,
      shouldPlaySound: enabled,
      shouldSetBadge: false,
    };
  },
});

export async function registerForPushNotifications() {
  if (!Device.isDevice) return null;
  if ((await AsyncStorage.getItem(NOTIF_PREF_KEY)) === "0") return null;

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

  await AsyncStorage.multiSet([
    [NOTIF_PREF_KEY, "1"],
    [PUSH_TOKEN_KEY, token],
  ]);
  await savePushToken(token);
  return token;
}

export async function disablePushNotifications() {
  await AsyncStorage.setItem(NOTIF_PREF_KEY, "0");
  const token = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
  if (token) {
    await deletePushToken(token);
    await AsyncStorage.removeItem(PUSH_TOKEN_KEY);
  }
}

async function savePushToken(token) {
  try {
    const authToken = await AsyncStorage.getItem("token");
    await fetch(`${API_BASE_URL}/api/push-tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ token }),
    });
  } catch (e) {
    console.log("❌ Error guardando token:", e.message);
  }
}

async function deletePushToken(token) {
  try {
    const authToken = await AsyncStorage.getItem("token");
    await fetch(`${API_BASE_URL}/api/push-tokens`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ token }),
    });
  } catch (e) {
    console.log("❌ Error eliminando token:", e.message);
  }
}
