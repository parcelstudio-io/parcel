import { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Text, TextInput } from "@/components/AppText";
import type { FeedThread } from "@/lib/types";
import { Avatar } from "./Avatar";
import { currentUser } from "@/lib/mock-data";
import { useTheme, useThemedStyles } from "@/lib/ThemeProvider";
import { radius, spacing, type Theme } from "@/lib/theme";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = { thread: FeedThread };

export function FeedThreadCard({ thread }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
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
    <View style={[styles.card, styles.cardBorder]}>
      <View style={styles.topRow}>
        <Avatar user={thread.theirUser} size={44} />
        <View style={styles.topMeta}>
          <Text style={styles.hostLine}>
            {thread.yourAgent} · {thread.theirAgent}
          </Text>
          <Text style={styles.time}>{thread.timestamp}</Text>
        </View>
      </View>

      <Text style={styles.title}>{thread.title}</Text>
      <Text style={styles.summary}>{thread.summary}</Text>

      <Pressable onPress={toggleExpanded} style={styles.showMore}>
        <Text style={styles.showMoreText}>
          {expanded ? "Hide conversation" : "Show conversation"}
        </Text>
      </Pressable>

      {expanded && (
        <View style={styles.dialogue}>
          {thread.dialogue.map((msg) => (
            <View key={msg.id} style={styles.dialogueLine}>
              <Text style={styles.dialogueAgent}>{msg.agentName}</Text>
              <Text style={styles.dialogueContent}>{msg.content}</Text>
            </View>
          ))}
        </View>
      )}

      {comments.length > 0 && (
        <View style={styles.commentsBlock}>
          {comments.map((c) => (
            <View key={c.id} style={styles.commentRow}>
              <Text style={styles.commentAuthor}>{c.author.name}</Text>
              <Text style={styles.commentText}>{c.content}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.commentInputRow}>
        <TextInput
          style={styles.commentInput}
          value={comment}
          onChangeText={setComment}
          placeholder="Add a note…"
          placeholderTextColor={colors.textTertiary}
          onSubmitEditing={submitComment}
          returnKeyType="send"
        />
      </View>
    </View>
  );
}

function createStyles({ colors }: Theme) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.bg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
    },
    cardBorder: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    topRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      marginBottom: spacing.md,
    },
    topMeta: { flex: 1 },
    hostLine: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    time: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 2,
    },
    title: {
      fontSize: 17,
      fontWeight: "500",
      color: colors.text,
      letterSpacing: -0.2,
      marginBottom: spacing.sm,
    },
    summary: {
      fontSize: 15,
      lineHeight: 24,
      color: colors.textSecondary,
    },
    showMore: {
      marginTop: spacing.md,
      alignSelf: "flex-start",
    },
    showMoreText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.text,
      textDecorationLine: "underline",
      textDecorationStyle: "solid",
    },
    dialogue: {
      marginTop: spacing.md,
      paddingTop: spacing.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      gap: spacing.md,
    },
    dialogueLine: { gap: 4 },
    dialogueAgent: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    dialogueContent: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.text,
    },
    commentsBlock: {
      marginTop: spacing.md,
      paddingTop: spacing.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      gap: spacing.sm,
    },
    commentRow: { gap: 2 },
    commentAuthor: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    commentText: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.textSecondary,
    },
    commentInputRow: {
      marginTop: spacing.md,
    },
    commentInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: 12,
      fontSize: 15,
      backgroundColor: colors.bgMuted,
      color: colors.text,
    },
  });
}
