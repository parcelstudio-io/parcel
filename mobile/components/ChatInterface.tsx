import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { ChatMessage } from "@/lib/types";
import { initialChatMessages, agentResponses, currentUser } from "@/lib/mock-data";
import { Avatar } from "./Avatar";
import { colors, formatTime } from "@/lib/utils";

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  const sendMessage = (content: string) => {
    if (!content.trim()) return;

    const userMsg: ChatMessage = {
      id: `cm-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: formatTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const agentMsg: ChatMessage = {
        id: `cm-${Date.now()}-agent`,
        role: "agent",
        content: agentResponses[Math.floor(Math.random() * agentResponses.length)],
        timestamp: formatTime(),
      };
      setMessages((prev) => [...prev, agentMsg]);
    }, 800);
  };

  const toggleVoice = () => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      Alert.alert(
        "Voice input",
        "Voice chat works in the standalone iOS build. For now, type your message or install the development build via EAS (see mobile/README.md).",
        [{ text: "OK" }]
      );
      setIsListening(!isListening);
      setTimeout(() => setIsListening(false), 1500);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100}
    >
      <View style={styles.header}>
        <View style={styles.agentIcon}>
          <Ionicons name="hardware-chip" size={20} color={colors.brand600} />
        </View>
        <View>
          <Text style={styles.headerTitle}>Aria</Text>
          <Text style={styles.headerSub}>Your personal agent</Text>
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        renderItem={({ item }) => {
          const isUser = item.role === "user";
          return (
            <View style={[styles.messageRow, isUser && styles.messageRowUser]}>
              {!isUser && (
                <View style={styles.smallAgentIcon}>
                  <Ionicons name="hardware-chip" size={14} color={colors.brand600} />
                </View>
              )}
              {isUser && <Avatar user={currentUser} size={32} />}
              <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAgent]}>
                <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>
                  {item.content}
                </Text>
                <Text style={[styles.bubbleTime, isUser && styles.bubbleTimeUser]}>
                  {item.timestamp}
                </Text>
              </View>
              {isUser && <View style={{ width: 32 }} />}
              {!isUser && <View style={{ width: 32 }} />}
            </View>
          );
        }}
      />

      {isListening && (
        <Text style={styles.listening}>Listening...</Text>
      )}

      <View style={styles.inputBar}>
        <Pressable
          onPress={toggleVoice}
          style={[styles.micBtn, isListening && styles.micBtnActive]}
        >
          <Ionicons
            name={isListening ? "mic-off" : "mic"}
            size={22}
            color={isListening ? colors.red500 : colors.stone600}
          />
        </Pressable>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Tell Aria about yourself..."
          placeholderTextColor={colors.stone400}
          onSubmitEditing={() => sendMessage(input)}
          returnKeyType="send"
        />
        <Pressable
          onPress={() => sendMessage(input)}
          disabled={!input.trim()}
          style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
        >
          <Ionicons name="send" size={18} color={colors.white} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.stone200,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.stone100,
  },
  agentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.brand50,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "600" },
  headerSub: { fontSize: 12, color: colors.stone500 },
  messageList: { padding: 16, gap: 12 },
  messageRow: { flexDirection: "row", alignItems: "flex-end", gap: 8, marginBottom: 12 },
  messageRowUser: { justifyContent: "flex-end" },
  smallAgentIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.brand50,
    justifyContent: "center",
    alignItems: "center",
  },
  bubble: { maxWidth: "75%", borderRadius: 16, padding: 12 },
  bubbleUser: { backgroundColor: colors.brand600 },
  bubbleAgent: { backgroundColor: colors.stone100 },
  bubbleText: { fontSize: 14, lineHeight: 20, color: colors.stone800 },
  bubbleTextUser: { color: colors.white },
  bubbleTime: { fontSize: 11, color: colors.stone400, marginTop: 4 },
  bubbleTimeUser: { color: colors.brand100 },
  listening: { textAlign: "center", color: colors.brand600, fontSize: 13, paddingBottom: 8 },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.stone100,
  },
  micBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.stone100,
    justifyContent: "center",
    alignItems: "center",
  },
  micBtnActive: { backgroundColor: "#fee2e2" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.stone200,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: colors.stone50,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.brand600,
    justifyContent: "center",
    alignItems: "center",
  },
  sendBtnDisabled: { opacity: 0.4 },
});
