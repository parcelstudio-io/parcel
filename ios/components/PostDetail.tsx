import { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { Text, TextInput } from "@/components/AppText";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import type { Post } from "@/lib/types";
import { Avatar } from "@/components/Avatar";
import { currentUser } from "@/lib/mock-data";
import { useTheme, useThemedStyles } from "@/lib/ThemeProvider";
import { type Theme } from "@/lib/theme";

type Props = { post: Post };

export function PostDetail({ post }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(post.comments);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const submitComment = () => {
    if (!comment.trim()) return;
    setComments([
      ...comments,
      {
        id: `pc-${Date.now()}`,
        author: currentUser,
        content: comment.trim(),
        timestamp: "Just now",
      },
    ]);
    setComment("");
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: post.title,
          headerBackTitle: "Home",
        }}
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {post.type === "writing" ? (
          <View style={styles.writingBlock}>
            <Ionicons name="create-outline" size={24} color={colors.textTertiary} />
            <Text style={styles.writingTitle}>{post.title}</Text>
            {post.writingContent?.split("\n\n").map((p, i) => (
              <Text key={i} style={styles.writingPara}>
                {p}
              </Text>
            ))}
          </View>
        ) : (
          <View>
            <Image source={{ uri: post.imageUrl }} style={styles.heroImage} />
            {post.type === "video" && (
              <View style={styles.playOverlay}>
                <View style={styles.playBtn}>
                  <Ionicons name="play" size={28} color={colors.text} />
                </View>
              </View>
            )}
          </View>
        )}

        <View style={styles.body}>
          <View style={styles.authorRow}>
            <Avatar user={post.author} />
            <View>
              <Text style={styles.authorName}>{post.author.name}</Text>
              <Text style={styles.postTime}>{post.timestamp}</Text>
            </View>
          </View>

          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.caption}>{post.caption}</Text>

          <View style={styles.actions}>
            <Pressable onPress={handleLike} style={styles.actionBtn}>
              <Ionicons
                name={liked ? "heart" : "heart-outline"}
                size={22}
                color={liked ? colors.accent : colors.textSecondary}
              />
              <Text style={styles.actionText}>{likeCount}</Text>
            </Pressable>
            <View style={styles.actionBtn}>
              <Ionicons name="chatbubble-outline" size={22} color={colors.textSecondary} />
              <Text style={styles.actionText}>{comments.length}</Text>
            </View>
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
              placeholderTextColor={colors.textTertiary}
              onSubmitEditing={submitComment}
              returnKeyType="send"
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
}

function createStyles({ colors }: Theme) {
  return StyleSheet.create({
    scroll: { flex: 1, backgroundColor: colors.bgMuted },
    content: { paddingBottom: 32 },
    heroImage: { width: "100%", height: 360, resizeMode: "cover" },
    playOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 360,
      backgroundColor: "rgba(0,0,0,0.25)",
      justifyContent: "center",
      alignItems: "center",
    },
    playBtn: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: "rgba(255,255,255,0.9)",
      justifyContent: "center",
      alignItems: "center",
    },
    writingBlock: {
      backgroundColor: colors.bg,
      padding: 24,
    },
    writingTitle: {
      fontSize: 24,
      fontWeight: "700",
      marginTop: 12,
      marginBottom: 16,
      color: colors.text,
    },
    writingPara: {
      fontSize: 16,
      lineHeight: 26,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    body: {
      backgroundColor: colors.bg,
      padding: 20,
    },
    authorRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
    authorName: { fontSize: 15, fontWeight: "600", color: colors.text },
    postTime: { fontSize: 12, color: colors.textSecondary },
    title: { fontSize: 20, fontWeight: "700", marginBottom: 8, color: colors.text },
    caption: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    actions: {
      flexDirection: "row",
      gap: 24,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.borderLight,
      marginBottom: 16,
    },
    actionBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
    actionText: { fontSize: 14, color: colors.textSecondary, fontWeight: "500" },
    commentRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
    commentBubble: {
      flex: 1,
      backgroundColor: colors.bgMuted,
      borderRadius: 12,
      padding: 10,
    },
    commentAuthor: { fontSize: 14, fontWeight: "600", color: colors.text },
    commentTime: { fontSize: 12, fontWeight: "400", color: colors.textTertiary },
    commentText: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
    commentInputRow: { flexDirection: "row", gap: 12, alignItems: "center", marginTop: 8 },
    commentInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      fontSize: 14,
      backgroundColor: colors.bg,
      color: colors.text,
    },
  });
}
