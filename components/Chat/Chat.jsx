import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Send, ArrowLeft, Bot } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../ContextUser/UserContext";
import API_BASE_URL from "../api";

const SESSION_KEY = "chat_session_id";

async function getSessionId() {
  let id = await AsyncStorage.getItem(SESSION_KEY);
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    await AsyncStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function TypingIndicator() {
  const [dot, setDot] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setDot((d) => (d + 1) % 3), 500);
    return () => clearInterval(t);
  }, []);
  return (
    <View className="flex-row items-center gap-1 px-4 py-2">
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={{ opacity: dot === i ? 1 : 0.3 }}
          className="w-2 h-2 rounded-full bg-yellow-400"
        />
      ))}
    </View>
  );
}

export default function Chat() {
  const { user } = useUser();
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "bot",
      text: "¡Hola! Soy el asistente de TransferCash. ¿En qué puedo ayudarte hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", text },
    ]);
    setLoading(true);

    try {
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
      const reply =
        data.reply ||
        data.output ||
        data.text ||
        data.message ||
        "Hubo un problema al responder. Intenta de nuevo.";

      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString() + "b", role: "bot", text: reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "e",
          role: "bot",
          text: "Hubo un problema al responder. Intenta de nuevo.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <>
      <Stack.Screen
        options={{
          headerBackVisible: false,
          gestureEnabled: false,
          headerShadowVisible: true,
          headerStyle: {
            backgroundColor: "white",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.replace("/Home")}
              className="mr-2 p-1"
              hitSlop={8}
            >
              <ArrowLeft size={24} color="black" />
            </TouchableOpacity>
          ),
          headerTitle: () => (
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full overflow-hidden bg-yellow-400 border-2 border-yellow-400">
                <Image
                  source={require("../../assets/logopro2.png")}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              </View>
              <View>
                <Text className="text-black text-base font-bold leading-tight">
                  Asistente TC
                </Text>
                <Text className="text-green-500 text-xs font-medium">
                  en línea
                </Text>
              </View>
            </View>
          ),
          headerTitleAlign: "left",
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 80}
      >
        <ScrollView
          ref={scrollRef}
          className="flex-1 px-4 pt-4"
          contentContainerStyle={{ paddingBottom: 16 }}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
        >

          {messages.map((msg) => (
            <View
              key={msg.id}
              className={`mb-3 max-w-[80%] ${
                msg.role === "user" ? "self-end" : "self-start"
              }`}
            >
              {msg.role === "bot" && (
                <View className="flex-row items-center gap-1 mb-1">
                  <Bot size={14} color="#EAB308" />
                  <Text className="text-yellow-500 text-xs font-semibold">
                    Asistente
                  </Text>
                </View>
              )}
              <View
                className={`px-4 py-3 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-yellow-400 rounded-tr-sm"
                    : "bg-gray-100 rounded-tl-sm"
                }`}
              >
                <Text
                  className={`text-sm leading-5 ${
                    msg.role === "user"
                      ? "text-black font-medium"
                      : "text-gray-800"
                  }`}
                >
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}

          {loading && (
            <View className="self-start mb-3 bg-gray-100 rounded-2xl rounded-tl-sm px-2 py-1">
              <TypingIndicator />
            </View>
          )}
        </ScrollView>

        <View className="flex-row items-end px-4 py-3 border-t border-gray-100 bg-white gap-3">
          <TextInput
            className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 text-sm text-black max-h-28"
            placeholder="Escribe un mensaje..."
            placeholderTextColor="#9CA3AF"
            value={input}
            onChangeText={setInput}
            multiline
            onSubmitEditing={sendMessage}
            blurOnSubmit={false}
            editable={!loading}
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={!input.trim() || loading}
            className={`w-12 h-12 rounded-full items-center justify-center ${
              input.trim() && !loading ? "bg-yellow-400" : "bg-gray-200"
            }`}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#EAB308" />
            ) : (
              <Send size={20} color={input.trim() ? "black" : "#9CA3AF"} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
