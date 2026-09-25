import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../api";
import { WELCOME_MESSAGE } from "../data/welcome";

const SESSION_KEY = "chat_session_id";
const MESSAGES_KEY = "chat_messages_history";
const MAX_STORED_MESSAGES = 60;

export async function getSessionId() {
  let id = await AsyncStorage.getItem(SESSION_KEY);
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    await AsyncStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export async function loadMessages() {
  try {
    const raw = await AsyncStorage.getItem(MESSAGES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [WELCOME_MESSAGE];
}

export async function saveMessages(msgs) {
  try {
    await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(msgs.slice(-MAX_STORED_MESSAGES)));
  } catch {}
}

export async function enviarMensaje(text, user) {
  const token = await AsyncStorage.getItem("token");
  const sessionId = await getSessionId();

  const res = await fetch(`${API_BASE_URL}/api/chat/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      message: text,
      session_id: sessionId,
      user_id: user?.id ?? null,
      user_name: user?.first_name ?? null,
      user_email: user?.email ?? null,
      is_authenticated: !!user,
    }),
  });

  const data = await res.json();
  return (
    data.reply || data.output || data.text || data.message ||
    "Hubo un problema al responder. Intenta de nuevo."
  );
}
