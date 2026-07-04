import { View, Image, StyleSheet, Pressable, Dimensions } from "react-native";
import { Text } from "@/components/AppText";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import type { Post } from "@/lib/types";
import { colors, radius, spacing } from "@/lib/utils";

const { width } = Dimensions.get("window");
const cardWidth = (width - spacing.lg * 2 - spacing.sm) / 2;

type Props = { post: Post };

export function PostCard({ post }: Props) {
  return (
    <Link href={`/post/${post.id}`} asChild>
      <Pressable style={styles.card}>
        {post.type === "writing" ? (
          <View style={styles.writingCard}>
            <Text style={styles.writingTitle} numberOfLines={2}>
              {post.title}
            </Text>
            <Text style={styles.writingPreview} numberOfLines={3}>
              {post.writingContent}
            </Text>
          </View>
        ) : (
          <View style={styles.imageWrap}>
            <Image source={{ uri: post.imageUrl }} style={styles.image} />
            {post.type === "video" && (
              <View style={styles.playBadge}>
                <Ionicons name="play" size={14} color={colors.white} />
              </View>
            )}
          </View>
        )}
        <View style={styles.meta}>
          <Text style={styles.metaTitle} numberOfLines={1}>
            {post.title}
          </Text>
          <Text style={styles.metaSub}>
            {post.likes} likes · {post.comments.length} comments
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

export function getCardWidth() {
  return cardWidth;
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    marginBottom: spacing.lg,
  },
  imageWrap: {
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.bgMuted,
  },
  image: {
    width: "100%",
    height: cardWidth * 1.15,
    resizeMode: "cover",
  },
  playBadge: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  writingCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.bgMuted,
    padding: spacing.md,
    minHeight: 140,
    justifyContent: "flex-end",
  },
  writingTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  writingPreview: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  meta: {
    marginTop: spacing.sm,
    paddingHorizontal: 2,
  },
  metaTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  metaSub: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
