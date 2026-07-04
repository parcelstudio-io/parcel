import { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  FlatList,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Text, TextInput } from "@/components/AppText";
import { Ionicons } from "@expo/vector-icons";
import type { ChatMessage } from "@/lib/types";
import { initialChatMessages } from "@/lib/mock-data";
import { sendAgentMessage } from "@/lib/agent";
import { useTheme, useThemedStyles } from "@/lib/ThemeProvider";
import { useKeyboardHeight } from "@/hooks/useKeyboardHeight";
import { formatTime, radius, spacing, labelStyle, type Theme } from "@/lib/theme";
import { FLOATING_TAB_BAR_CLEARANCE } from "@/lib/tabBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function ChatInterface() {
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();
  const { colors, shadow } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const listRef = useRef<FlatList>(null);

  const scrollToEnd = () => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
  };

  useEffect(() => {
    scrollToEnd();
  }, [messages, keyboardHeight]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `cm-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: formatTime(),
    };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);
    scrollToEnd();

    try {
      const reply = await sendAgentMessage(
        nextMessages.map((m) => ({ role: m.role, content: m.content }))
      );
      const agentMsg: ChatMessage = {
        id: `cm-${Date.now()}-agent`,
        role: "agent",
        content: reply,
        timestamp: formatTime(),
      };
      setMessages((prev) => [...prev, agentMsg]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not reach the agent.";
      Alert.alert(
        "Agent unavailable",
        `${message}\n\nRun Ollama and pnpm setup:gemma, then start the web app (pnpm dev:web) or set EXPO_PUBLIC_OLLAMA_HOST to your machine IP.`
      );
    } finally {
      setIsLoading(false);
    }
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

  const inputBottomPadding =
    keyboardHeight > 0
      ? keyboardHeight
      : Math.max(insets.bottom, spacing.sm) + FLOATING_TAB_BAR_CLEARANCE;

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        ListHeaderComponent={
          <View style={styles.hero}>
            <Text style={styles.wordmark}>My agent</Text>
            <Text style={styles.heroTitle}>Aria</Text>
            <Text style={styles.heroSub}>
              Tell me about yourself — your interests, rhythm, and intentions. I’ll represent
              you with care.
            </Text>
          </View>
        }
        ListFooterComponent={
          isLoading ? (
            <View style={styles.typingRow}>
              <ActivityIndicator size="small" color={colors.textSecondary} />
              <Text style={styles.typingText}>Aria is thinking…</Text>
            </View>
          ) : null
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

      <View style={[styles.inputWrap, { paddingBottom: inputBottomPadding }]}>
        <View style={[styles.inputBar, shadow.input]}>
          <Pressable onPress={toggleVoice} hitSlop={8} style={styles.iconBtn}>
            <Ionicons
              name={isListening ? "mic" : "mic-outline"}
              size={24}
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
            onFocus={scrollToEnd}
            editable={!isLoading}
          />
          <Pressable
            onPress={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            style={[styles.sendBtn, (!input.trim() || isLoading) && styles.sendBtnOff]}
          >
            <Ionicons name="arrow-up" size={20} color={colors.buttonPrimaryIcon} />
          </Pressable>
        </View>
      </View>
    </View>
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
      paddingBottom: spacing.md + FLOATING_TAB_BAR_CLEARANCE,
    },
    hero: {
      paddingTop: spacing.lg,
      paddingBottom: spacing.xl,
    },
    wordmark: {
      ...labelStyle,
      color: colors.textSecondary,
      marginBottom: spacing.md,
    },
    heroTitle: {
      fontSize: 22,
      fontWeight: "500",
      color: colors.text,
      letterSpacing: -0.3,
      marginBottom: spacing.sm,
    },
    heroSub: {
      fontSize: 15,
      lineHeight: 24,
      color: colors.textSecondary,
      maxWidth: 320,
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
      borderRadius: radius.md,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    userText: {
      fontSize: 16,
      lineHeight: 24,
      color: colors.text,
    },
    typingRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      paddingVertical: spacing.sm,
    },
    typingText: {
      fontSize: 14,
      color: colors.textSecondary,
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
      backgroundColor: colors.chatBg,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.borderLight,
    },
    inputBar: {
      flexDirection: "row",
      alignItems: "flex-end",
      backgroundColor: colors.chatInputBg,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.chatInputBorder,
      paddingLeft: 4,
      paddingRight: 6,
      paddingVertical: 6,
      minHeight: 56,
    },
    iconBtn: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    input: {
      flex: 1,
      fontSize: 17,
      lineHeight: 24,
      color: colors.text,
      maxHeight: 160,
      paddingVertical: 12,
      paddingHorizontal: 6,
    },
    sendBtn: {
      width: 40,
      height: 40,
      borderRadius: radius.md,
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
