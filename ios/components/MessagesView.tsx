import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Conversation, DirectMessage } from "@/lib/types";
import { Avatar } from "./Avatar";
import { conversations, directMessages, currentUser } from "@/lib/mock-data";
import { colors, formatTime } from "@/lib/utils";

export function MessagesView() {
  const [selectedId, setSelectedId] = useState<string>("conv1");
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
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <Text style={styles.sidebarTitle}>Messages</Text>
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ConversationItem
              conversation={item}
              active={selectedId === item.id}
              onPress={() => setSelectedId(item.id)}
            />
          )}
        />
      </View>

      <KeyboardAvoidingView
        style={styles.chatPanel}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {selectedConv ? (
          <>
            <View style={styles.chatHeader}>
              <Avatar user={selectedConv.participant} size={36} />
              <View>
                <Text style={styles.chatName}>{selectedConv.participant.name}</Text>
                <Text style={styles.chatHandle}>{selectedConv.participant.handle}</Text>
              </View>
            </View>

            <FlatList
              data={currentMessages}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messageList}
              renderItem={({ item }) => {
                const isMe = item.senderId === currentUser.id;
                return (
                  <View style={[styles.msgRow, isMe && styles.msgRowMe]}>
                    <View style={[styles.msgBubble, isMe ? styles.msgBubbleMe : styles.msgBubbleThem]}>
                      <Text style={[styles.msgText, isMe && styles.msgTextMe]}>{item.content}</Text>
                      <Text style={[styles.msgTime, isMe && styles.msgTimeMe]}>{item.timestamp}</Text>
                    </View>
                  </View>
                );
              }}
            />

            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Type a message..."
                placeholderTextColor={colors.stone400}
                onSubmitEditing={sendMessage}
                returnKeyType="send"
              />
              <Pressable
                onPress={sendMessage}
                disabled={!input.trim()}
                style={[styles.sendBtn, !input.trim() && { opacity: 0.4 }]}
              >
                <Ionicons name="send" size={18} color={colors.white} />
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

function ConversationItem({
  conversation,
  active,
  onPress,
}: {
  conversation: Conversation;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.convItem, active && styles.convItemActive]}
    >
      <Avatar user={conversation.participant} size={44} />
      <View style={styles.convContent}>
        <View style={styles.convTop}>
          <Text style={styles.convName} numberOfLines={1}>
            {conversation.participant.name}
          </Text>
          <Text style={styles.convTime}>{conversation.lastMessageTime}</Text>
        </View>
        <Text style={styles.convPreview} numberOfLines={1}>
          {conversation.lastMessage}
        </Text>
      </View>
      {conversation.unread > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{conversation.unread}</Text>
        </View>
      )}
    </Pressable>
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
  sidebar: {
    maxHeight: 200,
    borderBottomWidth: 1,
    borderBottomColor: colors.stone100,
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: "600",
    padding: 16,
    paddingBottom: 8,
  },
  convItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  convItemActive: { backgroundColor: colors.brand50 },
  convContent: { flex: 1, minWidth: 0 },
  convTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  convName: { fontSize: 15, fontWeight: "600", flex: 1 },
  convTime: { fontSize: 12, color: colors.stone400 },
  convPreview: { fontSize: 14, color: colors.stone500 },
  badge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.brand600,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { color: colors.white, fontSize: 11, fontWeight: "600" },
  chatPanel: { flex: 1 },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.stone100,
  },
  chatName: { fontSize: 16, fontWeight: "600" },
  chatHandle: { fontSize: 12, color: colors.stone500 },
  messageList: { padding: 16, flexGrow: 1 },
  msgRow: { marginBottom: 8, alignItems: "flex-start" },
  msgRowMe: { alignItems: "flex-end" },
  msgBubble: { maxWidth: "80%", borderRadius: 16, padding: 12 },
  msgBubbleMe: { backgroundColor: colors.brand600 },
  msgBubbleThem: { backgroundColor: colors.stone100 },
  msgText: { fontSize: 14, color: colors.stone800 },
  msgTextMe: { color: colors.white },
  msgTime: { fontSize: 11, color: colors.stone400, marginTop: 4 },
  msgTimeMe: { color: colors.brand100 },
  inputRow: {
    flexDirection: "row",
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.stone100,
  },
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
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: colors.stone400 },
});
