import { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text, TextInput } from "@/components/AppText";
import { Ionicons } from "@expo/vector-icons";
import type { DirectMessage } from "@/lib/types";
import { Avatar } from "./Avatar";
import { conversations, directMessages, currentUser } from "@/lib/mock-data";
import { useTheme, useThemedStyles } from "@/lib/ThemeProvider";
import { formatTime, radius, spacing, type Theme } from "@/lib/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function MessagesView() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [selectedId, setSelectedId] = useState<string | null>("conv1");
  const [messages, setMessages] = useState<Record<string, DirectMessage[]>>(directMessages);
  const [input, setInput] = useState("");

  const selectedConv = conversations.find((c) => c.id === selectedId);
  const currentMessages = selectedId ? messages[selectedId] || [] : [];

  const sendMessage = () => {
    if (!input.trim() || !selectedId) return;
    const newMsg: DirectMessage = {
      id: `dm-${Date.now()}`,
      senderId: currentUser.id,
      content: input.trim(),
      timestamp: formatTime(),
    };
    setMessages((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), newMsg],
    }));
    setInput("");
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <Text style={styles.pageTitle}>Inbox</Text>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setSelectedId(item.id)}
            style={[styles.chip, selectedId === item.id && styles.chipActive]}
          >
            <Avatar user={item.participant} size={32} />
            <Text
              style={[styles.chipName, selectedId === item.id && styles.chipNameActive]}
              numberOfLines={1}
            >
              {item.participant.name.split(" ")[0]}
            </Text>
          </Pressable>
        )}
      />

      <KeyboardAvoidingView
        style={styles.chatArea}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        {selectedConv ? (
          <>
            <View style={styles.chatHeader}>
              <Text style={styles.chatName}>{selectedConv.participant.name}</Text>
              <Text style={styles.chatHandle}>{selectedConv.participant.handle}</Text>
            </View>

            <FlatList
              data={currentMessages}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messageList}
              renderItem={({ item }) => {
                const isMe = item.senderId === currentUser.id;
                return (
                  <View style={[styles.msgRow, isMe && styles.msgRowMe]}>
                    {isMe ? (
                      <View style={styles.bubbleMe}>
                        <Text style={styles.textMe}>{item.content}</Text>
                      </View>
                    ) : (
                      <Text style={styles.textThem}>{item.content}</Text>
                    )}
                  </View>
                );
              }}
            />

            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Message…"
                placeholderTextColor={colors.textTertiary}
                onSubmitEditing={sendMessage}
                returnKeyType="send"
              />
              <Pressable
                onPress={sendMessage}
                disabled={!input.trim()}
                style={[styles.sendBtn, !input.trim() && styles.sendBtnOff]}
              >
                <Ionicons name="arrow-up" size={18} color={colors.buttonPrimaryIcon} />
              </Pressable>
            </View>
          </>
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Select a conversation</Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

function createStyles({ colors }: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.bg },
    pageTitle: {
      fontSize: 28,
      fontWeight: "600",
      color: colors.text,
      letterSpacing: -0.5,
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.md,
    },
    chipRow: {
      paddingHorizontal: spacing.lg,
      gap: spacing.sm,
      paddingBottom: spacing.md,
    },
    chip: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: colors.border,
      maxWidth: 160,
    },
    chipActive: {
      borderColor: colors.text,
      backgroundColor: colors.bgMuted,
    },
    chipName: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
      flexShrink: 1,
    },
    chipNameActive: {
      color: colors.text,
      fontWeight: "600",
    },
    chatArea: {
      flex: 1,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    chatHeader: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    chatName: { fontSize: 17, fontWeight: "600", color: colors.text },
    chatHandle: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
    messageList: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, flexGrow: 1 },
    msgRow: { marginBottom: spacing.md, alignItems: "flex-start" },
    msgRowMe: { alignItems: "flex-end" },
    bubbleMe: {
      maxWidth: "85%",
      backgroundColor: colors.chatUserBubble,
      borderRadius: radius.xl,
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    textMe: { fontSize: 16, lineHeight: 22, color: colors.text },
    textThem: {
      fontSize: 16,
      lineHeight: 24,
      color: colors.text,
      maxWidth: "92%",
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.borderLight,
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.pill,
      paddingHorizontal: spacing.md,
      paddingVertical: 12,
      fontSize: 16,
      backgroundColor: colors.bg,
      color: colors.text,
    },
    sendBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.buttonPrimary,
      alignItems: "center",
      justifyContent: "center",
    },
    sendBtnOff: { backgroundColor: colors.buttonDisabled },
    empty: { flex: 1, justifyContent: "center", alignItems: "center" },
    emptyText: { color: colors.textSecondary },
  });
}
