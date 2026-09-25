import { View, ScrollView, KeyboardAvoidingView } from "react-native";
import { Stack } from "expo-router";
import { useChat } from "../components/Chat/hooks/useChat";
import ChatHeader from "../components/Chat/ChatHeader";
import MessageBubble from "../components/Chat/MessageBubble";
import TypingIndicator from "../components/Chat/TypingIndicator";
import ChatInput from "../components/Chat/ChatInput";

export default function ChatPage() {
  const { messages, input, setInput, loading, scrollRef, sendMessage } = useChat();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      className="bg-background"
      behavior="padding"
      keyboardVerticalOffset={0}
    >
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />

      <ChatHeader />

      <ScrollView
        ref={scrollRef}
        className="flex-1 px-4 pt-4 bg-background"
        contentContainerStyle={{ paddingBottom: 16 }}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {loading && (
          <View className="self-start mb-3 bg-surface rounded-2xl rounded-tl-sm px-2 py-1">
            <TypingIndicator />
          </View>
        )}
      </ScrollView>

      <ChatInput input={input} setInput={setInput} loading={loading} onSend={sendMessage} />
    </KeyboardAvoidingView>
  );
}
