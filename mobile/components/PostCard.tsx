import { View, Text, Image, StyleSheet, Pressable, Dimensions } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import type { Post } from "@/lib/types";
import { colors } from "@/lib/utils";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

type Props = { post: Post };

export function PostCard({ post }: Props) {
  return (
    <Link href={`/post/${post.id}`} asChild>
      <Pressable style={styles.card}>
        {post.type === "writing" ? (
          <View style={[styles.writingCard, { minHeight: 180 }]}>
            <Ionicons name="create-outline" size={20} color={colors.stone400} />
            <Text style={styles.writingTitle}>{post.title}</Text>
            <Text style={styles.writingPreview} numberOfLines={4}>
              {post.writingContent}
            </Text>
          </View>
        ) : (
          <View>
            <Image source={{ uri: post.imageUrl }} style={styles.image} />
            {post.type === "video" && (
              <View style={styles.playOverlay}>
                <View style={styles.playBtn}>
                  <Ionicons name="play" size={20} color={colors.stone900} />
                </View>
              </View>
            )}
          </View>
        )}
        <View style={styles.footer}>
          <View style={styles.stat}>
            <Ionicons name="heart-outline" size={14} color={colors.stone500} />
            <Text style={styles.statText}>{post.likes}</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="chatbubble-outline" size={14} color={colors.stone500} />
            <Text style={styles.statText}>{post.comments.length}</Text>
          </View>
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
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  image: { width: "100%", height: cardWidth * 1.2, resizeMode: "cover" },
  playOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  playBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  writingCard: {
    padding: 16,
    backgroundColor: colors.stone100,
    justifyContent: "space-between",
  },
  writingTitle: { fontSize: 15, fontWeight: "600", color: colors.stone900, marginTop: 8 },
  writingPreview: { fontSize: 13, lineHeight: 18, color: colors.stone600, marginTop: 8 },
  footer: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.stone100,
  },
  stat: { flexDirection: "row", alignItems: "center", gap: 4 },
  statText: { fontSize: 12, color: colors.stone500 },
});
