import { useEffect, useState } from "react";
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
import { useNavigation } from "expo-router";
import type { Conversation, DirectMessage } from "@/lib/types";
import { Avatar } from "./Avatar";
import { conversations, directMessages, currentUser } from "@/lib/mock-data";
import { useTheme, useThemedStyles } from "@/lib/ThemeProvider";
import { formatTime, radius, spacing, type Theme } from "@/lib/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function MessagesView() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, DirectMessage[]>>(directMessages);
  const [input, setInput] = useState("");

  const selectedConv = conversations.find((c) => c.id === selectedId);
  const currentMessages = selectedId ? messages[selectedId] || [] : [];

  useEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({
      tabBarStyle: selectedId
        ? { display: "none" }
        : {
            backgroundColor: colors.tabBarBg,
            borderTopColor: colors.borderLight,
            borderTopWidth: 0.5,
            paddingTop: 4,
          },
    });

    return () => {
      parent?.setOptions({
        tabBarStyle: {
          backgroundColor: colors.tabBarBg,
          borderTopColor: colors.borderLight,
          borderTopWidth: 0.5,
          paddingTop: 4,
        },
      });
    };
  }, [selectedId, navigation, colors.tabBarBg, colors.borderLight]);

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

  if (selectedConv) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <View style={styles.chatHeader}>
          <Pressable
            onPress={() => setSelectedId(null)}
            hitSlop={12}
            style={styles.backBtn}
            accessibilityLabel="Back to inbox"
          >
            <Ionicons name="chevron-back" size={28} color={colors.text} />
          </Pressable>
          <Pressable style={styles.chatHeaderCenter}>
            <Avatar user={selectedConv.participant} size={36} />
            <Text style={styles.chatName} numberOfLines={1}>
              {selectedConv.participant.name}
            </Text>
          </Pressable>
          <Pressable hitSlop={12} style={styles.headerAction}>
            <Ionicons name="information-circle-outline" size={24} color={colors.text} />
          </Pressable>
        </View>

        <KeyboardAvoidingView
          style={styles.chatBody}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={insets.top}
        >
          <FlatList
            data={currentMessages}
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

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.inboxHeader}>
        <Text style={styles.inboxTitle}>{currentUser.handle.replace("@", "")}</Text>
        <Pressable hitSlop={12} accessibilityLabel="New message">
          <Ionicons name="create-outline" size={26} color={colors.text} />
        </Pressable>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.md }}
        renderItem={({ item }) => (
          <ConversationRow
            conversation={item}
            onPress={() => setSelectedId(item.id)}
            styles={styles}
          />
        )}
      />
    </View>
  );
}

function ConversationRow({
  conversation,
  onPress,
  styles,
}: {
  conversation: Conversation;
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
}) {
  const unread = conversation.unread > 0;
  const firstName = conversation.participant.name.split(" ")[0];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <View style={styles.avatarWrap}>
        <Avatar user={conversation.participant} size={56} />
        {unread ? <View style={styles.unreadDot} /> : null}
      </View>
      <View style={styles.rowContent}>
        <View style={styles.rowTop}>
          <Text style={[styles.rowName, unread && styles.rowNameUnread]} numberOfLines={1}>
            {firstName}
          </Text>
          <Text style={styles.rowTime}>{conversation.lastMessageTime}</Text>
        </View>
        <Text
          style={[styles.rowPreview, unread && styles.rowPreviewUnread]}
          numberOfLines={1}
        >
          {conversation.lastMessage}
        </Text>
      </View>
    </Pressable>
  );
}

function createStyles({ colors }: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.bg },
    inboxHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
      paddingBottom: spacing.md,
    },
    inboxTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
      letterSpacing: -0.3,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.md,
      paddingVertical: 10,
      gap: spacing.md,
    },
    rowPressed: {
      backgroundColor: colors.bgMuted,
    },
    avatarWrap: {
      position: "relative",
    },
    unreadDot: {
      position: "absolute",
      bottom: 2,
      right: 2,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.dmUnread,
      borderWidth: 2,
      borderColor: colors.bg,
    },
    rowContent: {
      flex: 1,
      minWidth: 0,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderLight,
      paddingBottom: 12,
    },
    rowTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm,
      marginBottom: 2,
    },
    rowName: {
      flex: 1,
      fontSize: 16,
      fontWeight: "400",
      color: colors.text,
    },
    rowNameUnread: {
      fontWeight: "700",
    },
    rowTime: {
      fontSize: 13,
      color: colors.textTertiary,
    },
    rowPreview: {
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    rowPreviewUnread: {
      color: colors.text,
      fontWeight: "500",
    },
    chatHeader: {
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
    chatHeaderCenter: {
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
    chatName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      maxWidth: "70%",
    },
    chatBody: {
      flex: 1,
    },
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
    msgRowMe: {
      alignSelf: "flex-end",
    },
    msgRowThem: {
      alignSelf: "flex-start",
    },
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
    bubbleTextMe: {
      color: "#FFFFFF",
    },
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
