import { useEffect, useState } from "react";
import { Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useFeedback } from "../../Feedback/FeedbackContext";
import {
  NOTIF_PREF_KEY,
  registerForPushNotifications,
  disablePushNotifications,
} from "../../../utils/notifications";

export function usePreferences() {
  const feedback = useFeedback();
  const [notifications, setNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    (async () => {
      const pref = await AsyncStorage.getItem(NOTIF_PREF_KEY);
      const perm = await Notifications.getPermissionsAsync();
      setNotifications(pref !== "0" && perm.granted);
    })();
  }, []);

  const toggleNotifications = async (next) => {
    if (next) {
      await AsyncStorage.setItem(NOTIF_PREF_KEY, "1");
      const token = await registerForPushNotifications();
      if (!token) {
        await AsyncStorage.setItem(NOTIF_PREF_KEY, "0");
        const ok = await feedback.confirm({
          title: "Notificaciones bloqueadas",
          message: "Activa los permisos de notificaciones desde la configuración del sistema.",
          confirmText: "Abrir ajustes",
        });
        if (ok) Linking.openSettings();
        return;
      }
      setNotifications(true);
      return;
    }
    await disablePushNotifications();
    setNotifications(false);
  };

  return { notifications, toggleNotifications, darkMode, setDarkMode };
}
