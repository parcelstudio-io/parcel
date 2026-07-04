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
import { router } from "expo-router";
import type { Conversation, DirectMessage } from "@/lib/types";
import { Avatar } from "@/components/Avatar";
import { directMessages, currentUser } from "@/lib/mock-data";
import { useTheme, useThemedStyles } from "@/lib/ThemeProvider";
import { formatTime, radius, spacing, type Theme } from "@/lib/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ConversationViewProps = {
  conversation: Conversation;
};

export function ConversationView({ conversation }: ConversationViewProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [messages, setMessages] = useState<DirectMessage[]>(
    directMessages[conversation.id] || []
  );
  const [input, setInput] = useState("");

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

      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={insets.top}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
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

        <View style={[styles.inputRow, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
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
            />
            {input.trim() ? (
              <Pressable onPress={sendMessage} hitSlop={8}>
                <Text style={styles.sendLabel}>Send</Text>
              </Pressable>
            ) : (
              <View style={styles.inputIcons}>
                <Ionicons name="camera-outline" size={22} color={colors.text} />
                <Ionicons name="mic-outline" size={22} color={colors.text} />
                <Ionicons name="image-outline" size={22} color={colors.text} />
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
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
      borderRadius: 22,
      paddingHorizontal: 14,
      paddingVertical: 9,
    },
    bubbleMe: {
      backgroundColor: colors.dmSent,
      borderBottomRightRadius: 6,
    },
    bubbleThem: {
      backgroundColor: colors.dmReceived,
      borderBottomLeftRadius: 6,
    },
    bubbleText: {
      fontSize: 16,
      lineHeight: 21,
      color: colors.text,
    },
    bubbleTextMe: { color: "#FFFFFF" },
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
      minHeight: 44,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: colors.border,
      paddingLeft: spacing.md,
      paddingRight: spacing.sm,
      backgroundColor: colors.bg,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      paddingVertical: 10,
      maxHeight: 100,
    },
    sendLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.dmSent,
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
