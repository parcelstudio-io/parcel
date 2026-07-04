import { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Platform,
} from "react-native";
import { Text, TextInput } from "@/components/AppText";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import type { Conversation, DirectMessage } from "@/lib/types";
import { Avatar } from "@/components/Avatar";
import { directMessages, currentUser } from "@/lib/mock-data";
import { useTheme, useThemedStyles } from "@/lib/ThemeProvider";
import { useKeyboardHeight } from "@/hooks/useKeyboardHeight";
import { formatTime, radius, spacing, type Theme } from "@/lib/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ConversationViewProps = {
  conversation: Conversation;
};

export function ConversationView({ conversation }: ConversationViewProps) {
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const listRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<DirectMessage[]>(
    directMessages[conversation.id] || []
  );
  const [input, setInput] = useState("");

  const scrollToEnd = () => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
  };

  useEffect(() => {
    scrollToEnd();
  }, [messages, keyboardHeight]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: DirectMessage = {
      id: `dm-${Date.now()}`,
      senderId: currentUser.id,
      content: input.trim(),
      timestamp: formatTime(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  const inputBottomPadding =
    keyboardHeight > 0 ? keyboardHeight : Math.max(insets.bottom, spacing.sm);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.backBtn}
          accessibilityLabel="Back to inbox"
        >
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </Pressable>
        <Pressable style={styles.headerCenter}>
          <Avatar user={conversation.participant} size={36} />
          <Text style={styles.name} numberOfLines={1}>
            {conversation.participant.name}
          </Text>
        </Pressable>
        <Pressable hitSlop={12} style={styles.headerAction}>
          <Ionicons name="information-circle-outline" size={24} color={colors.text} />
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        style={styles.body}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        renderItem={({ item }) => {
          const isMe = item.senderId === currentUser.id;
          return (
            <View style={[styles.msgRow, isMe ? styles.msgRowMe : styles.msgRowThem]}>
              <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
                <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>
                  {item.content}
                </Text>
              </View>
            </View>
          );
        }}
      />

      <View style={[styles.inputRow, { paddingBottom: inputBottomPadding }]}>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Message…"
            placeholderTextColor={colors.textTertiary}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            multiline
            onFocus={scrollToEnd}
          />
          {input.trim() ? (
            <Pressable onPress={sendMessage} hitSlop={8}>
              <Text style={styles.sendLabel}>Send</Text>
            </Pressable>
          ) : (
            <View style={styles.inputIcons}>
              <Ionicons name="camera-outline" size={24} color={colors.text} />
              <Ionicons name="mic-outline" size={24} color={colors.text} />
              <Ionicons name="image-outline" size={24} color={colors.text} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

function createStyles({ colors }: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.bg },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderLight,
    },
    backBtn: {
      width: 40,
      alignItems: "flex-start",
    },
    headerCenter: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      paddingHorizontal: spacing.sm,
    },
    headerAction: {
      width: 40,
      alignItems: "flex-end",
    },
    name: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      maxWidth: "70%",
    },
    body: { flex: 1 },
    messageList: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
      flexGrow: 1,
    },
    msgRow: {
      marginBottom: 4,
      maxWidth: "78%",
    },
    msgRowMe: { alignSelf: "flex-end" },
    msgRowThem: { alignSelf: "flex-start" },
    bubble: {
      borderRadius: radius.md,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    bubbleMe: {
      backgroundColor: colors.dmSent,
    },
    bubbleThem: {
      backgroundColor: colors.dmReceived,
    },
    bubbleText: {
      fontSize: 17,
      lineHeight: 22,
      color: colors.text,
    },
    bubbleTextMe: { color: colors.buttonPrimaryIcon },
    inputRow: {
      paddingHorizontal: spacing.sm,
      paddingTop: spacing.sm,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.borderLight,
      backgroundColor: colors.bg,
    },
    inputWrap: {
      flexDirection: "row",
      alignItems: "center",
      minHeight: 52,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingLeft: spacing.md,
      paddingRight: spacing.sm,
      backgroundColor: colors.bg,
    },
    input: {
      flex: 1,
      fontSize: 17,
      color: colors.text,
      paddingVertical: 14,
      maxHeight: 140,
    },
    sendLabel: {
      fontSize: 14,
      fontWeight: "500",
      letterSpacing: 0.5,
      color: colors.text,
      paddingHorizontal: spacing.sm,
    },
    inputIcons: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      paddingHorizontal: spacing.xs,
    },
  });
}
