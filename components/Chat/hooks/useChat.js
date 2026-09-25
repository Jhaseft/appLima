import { useState, useRef, useEffect } from "react";
import { useUser } from "../../ContextUser/UserContext";
import { WELCOME_MESSAGE } from "../data/welcome";
import { loadMessages, saveMessages, enviarMensaje } from "../services/chatApi";

const ERROR_TEXT = "Hubo un problema al responder. Intenta de nuevo.";

// Orquestacion del chat: mensajes (persistidos en AsyncStorage), input, estado de
// "escribiendo" y envio al backend. La ruta solo compone la UI con esto.
export function useChat() {
  const { user } = useUser();
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    loadMessages().then(setMessages);
  }, []);

  useEffect(() => {
    if (messages.length > 0) saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user", text }]);
    setLoading(true);

    try {
      const reply = await enviarMensaje(text, user);
      setMessages((prev) => [...prev, { id: Date.now().toString() + "b", role: "bot", text: reply }]);
    } catch {
      setMessages((prev) => [...prev, { id: Date.now().toString() + "e", role: "bot", text: ERROR_TEXT }]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, input, setInput, loading, scrollRef, sendMessage };
}
