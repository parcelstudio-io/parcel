import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { FeedThread } from "@/lib/types";
import { Avatar } from "./Avatar";
import { currentUser } from "@/lib/mock-data";
import { colors } from "@/lib/utils";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = { thread: FeedThread };

export function FeedThreadCard({ thread }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(thread.comments);

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const submitComment = () => {
    if (!comment.trim()) return;
    setComments([
      ...comments,
      {
        id: `c-${Date.now()}`,
        author: currentUser,
        content: comment.trim(),
        timestamp: "Just now",
      },
    ]);
    setComment("");
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.userRow}>
          <Avatar user={thread.theirUser} size={40} />
          <View>
            <Text style={styles.userName}>{thread.theirUser.name}</Text>
            <Text style={styles.timestamp}>{thread.timestamp}</Text>
          </View>
        </View>
        <View style={styles.agentBadge}>
          <Ionicons name="hardware-chip-outline" size={12} color={colors.stone600} />
          <Text style={styles.agentText}>
            {thread.yourAgent} ↔ {thread.theirAgent}
          </Text>
        </View>
      </View>

      <Text style={styles.title}>{thread.title}</Text>
      <Text style={styles.summary}>{thread.summary}</Text>

      <Pressable onPress={toggleExpanded} style={styles.expandBtn}>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={16}
          color={colors.brand600}
        />
        <Text style={styles.expandText}>
          {expanded
            ? "Hide full dialogue"
            : `View full agent dialogue (${thread.dialogue.length} messages)`}
        </Text>
      </Pressable>

      {expanded && (
        <View style={styles.dialogue}>
          {thread.dialogue.map((msg) => {
            const isYours = msg.agentName === thread.yourAgent;
            return (
              <View
                key={msg.id}
                style={[styles.msgBubble, isYours ? styles.msgYours : styles.msgTheirs]}
              >
                <View style={styles.msgMeta}>
                  <Ionicons name="hardware-chip-outline" size={12} color={colors.stone400} />
                  <Text style={styles.msgAgent}>{msg.agentName}</Text>
                  <Text style={styles.msgTime}>{msg.timestamp}</Text>
                </View>
                <Text style={styles.msgContent}>{msg.content}</Text>
              </View>
            );
          })}
        </View>
      )}

      <View style={styles.commentsSection}>
        <View style={styles.commentsHeader}>
          <Ionicons name="chatbubble-outline" size={16} color={colors.stone700} />
          <Text style={styles.commentsTitle}>Comments ({comments.length})</Text>
        </View>

        {comments.map((c) => (
          <View key={c.id} style={styles.commentRow}>
            <Avatar user={c.author} size={32} />
            <View style={styles.commentBubble}>
              <Text style={styles.commentAuthor}>
                {c.author.name}{" "}
                <Text style={styles.commentTime}>{c.timestamp}</Text>
              </Text>
              <Text style={styles.commentText}>{c.content}</Text>
            </View>
          </View>
        ))}

        <View style={styles.commentInputRow}>
          <Avatar user={currentUser} size={32} />
          <TextInput
            style={styles.commentInput}
            value={comment}
            onChangeText={setComment}
            placeholder="Add a comment..."
            placeholderTextColor={colors.stone400}
            onSubmitEditing={submitComment}
            returnKeyType="send"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.stone200,
    marginBottom: 16,
    overflow: "hidden",
  },
  header: {
    padding: 16,
    paddingBottom: 0,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  userName: { fontSize: 14, fontWeight: "600", color: colors.stone900 },
  timestamp: { fontSize: 12, color: colors.stone500 },
  agentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: colors.stone100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  agentText: { fontSize: 12, color: colors.stone600 },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.stone900,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  summary: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.stone600,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  expandBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  expandText: { fontSize: 14, fontWeight: "500", color: colors.brand600 },
  dialogue: {
    backgroundColor: colors.stone50,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.stone100,
    gap: 12,
  },
  msgBubble: { borderRadius: 12, padding: 12 },
  msgYours: { backgroundColor: colors.brand50, marginRight: 32 },
  msgTheirs: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.stone200,
    marginLeft: 32,
  },
  msgMeta: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  msgAgent: { fontSize: 12, fontWeight: "500", color: colors.stone500 },
  msgTime: { fontSize: 12, color: colors.stone400 },
  msgContent: { fontSize: 14, lineHeight: 20, color: colors.stone700 },
  commentsSection: {
    borderTopWidth: 1,
    borderTopColor: colors.stone100,
    padding: 16,
  },
  commentsHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  commentsTitle: { fontSize: 14, fontWeight: "600", color: colors.stone700 },
  commentRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  commentBubble: {
    flex: 1,
    backgroundColor: colors.stone50,
    borderRadius: 12,
    padding: 10,
  },
  commentAuthor: { fontSize: 14, fontWeight: "600", color: colors.stone900 },
  commentTime: { fontSize: 12, fontWeight: "400", color: colors.stone400 },
  commentText: { fontSize: 14, color: colors.stone600, marginTop: 2 },
  commentInputRow: { flexDirection: "row", gap: 12, alignItems: "center", marginTop: 4 },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.stone200,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: colors.white,
  },
});
