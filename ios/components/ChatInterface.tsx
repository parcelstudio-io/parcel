import { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Text, TextInput } from "@/components/AppText";
import { Ionicons } from "@expo/vector-icons";
import type { ChatMessage } from "@/lib/types";
import { initialChatMessages, agentResponses } from "@/lib/mock-data";
import { useTheme, useThemedStyles } from "@/lib/ThemeProvider";
import { formatTime, radius, spacing, type Theme } from "@/lib/theme";

export function ChatInterface() {
  const { colors, shadow } = useTheme();
  const styles = useThemedStyles(createStyles);
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
    }, 700);
  };

  const toggleVoice = () => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      Alert.alert(
        "Voice",
        "Voice input is available in the standalone app build.",
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
      keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.hero}>
            <View style={styles.heroOrb}>
              <Text style={styles.heroInitial}>A</Text>
            </View>
            <Text style={styles.heroTitle}>Aria</Text>
            <Text style={styles.heroSub}>Tell me about yourself — I’ll represent you thoughtfully.</Text>
          </View>
        }
        renderItem={({ item }) => {
          if (item.role === "user") {
            return (
              <View style={styles.userRow}>
                <View style={styles.userBubble}>
                  <Text style={styles.userText}>{item.content}</Text>
                </View>
              </View>
            );
          }
          return (
            <View style={styles.agentBlock}>
              <Text style={styles.agentText}>{item.content}</Text>
            </View>
          );
        }}
      />

      {isListening && <Text style={styles.listening}>Listening…</Text>}

      <View style={styles.inputWrap}>
        <View style={[styles.inputBar, shadow.input]}>
          <Pressable onPress={toggleVoice} hitSlop={8} style={styles.iconBtn}>
            <Ionicons
              name={isListening ? "mic" : "mic-outline"}
              size={22}
              color={isListening ? colors.accent : colors.textSecondary}
            />
          </Pressable>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Message Aria…"
            placeholderTextColor={colors.textTertiary}
            multiline
            maxLength={2000}
            onSubmitEditing={() => sendMessage(input)}
            blurOnSubmit={false}
          />
          <Pressable
            onPress={() => sendMessage(input)}
            disabled={!input.trim()}
            style={[styles.sendBtn, !input.trim() && styles.sendBtnOff]}
          >
            <Ionicons name="arrow-up" size={18} color={colors.buttonPrimaryIcon} />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function createStyles({ colors }: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.chatBg,
    },
    messageList: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.md,
    },
    hero: {
      alignItems: "center",
      paddingTop: spacing.lg,
      paddingBottom: spacing.xl,
    },
    heroOrb: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.bgMuted,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing.md,
    },
    heroInitial: {
      fontSize: 22,
      fontWeight: "600",
      color: colors.text,
    },
    heroTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
      marginBottom: spacing.xs,
    },
    heroSub: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.textSecondary,
      textAlign: "center",
      maxWidth: 280,
    },
    agentBlock: {
      marginBottom: spacing.lg,
      paddingRight: spacing.md,
    },
    agentText: {
      fontSize: 16,
      lineHeight: 26,
      color: colors.chatAgentText,
      letterSpacing: 0.1,
    },
    userRow: {
      alignItems: "flex-end",
      marginBottom: spacing.lg,
    },
    userBubble: {
      maxWidth: "88%",
      backgroundColor: colors.chatUserBubble,
      borderRadius: radius.xl,
      paddingHorizontal: 18,
      paddingVertical: 12,
    },
    userText: {
      fontSize: 16,
      lineHeight: 24,
      color: colors.text,
    },
    listening: {
      textAlign: "center",
      color: colors.textSecondary,
      fontSize: 13,
      paddingBottom: spacing.sm,
    },
    inputWrap: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
      paddingBottom: spacing.md,
      backgroundColor: colors.chatBg,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.borderLight,
    },
    inputBar: {
      flexDirection: "row",
      alignItems: "flex-end",
      backgroundColor: colors.chatInputBg,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: colors.chatInputBorder,
      paddingLeft: 4,
      paddingRight: 4,
      paddingVertical: 4,
      minHeight: 48,
    },
    iconBtn: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    input: {
      flex: 1,
      fontSize: 16,
      lineHeight: 22,
      color: colors.text,
      maxHeight: 120,
      paddingVertical: 10,
      paddingHorizontal: 4,
    },
    sendBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.buttonPrimary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 2,
    },
    sendBtnOff: {
      backgroundColor: colors.buttonDisabled,
    },
  });
}
