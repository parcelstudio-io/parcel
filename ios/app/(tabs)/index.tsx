import { View, StyleSheet, ScrollView, Pressable, Image, Dimensions } from "react-native";
import { Text } from "@/components/AppText";
import { Link } from "expo-router";
import { posts, currentUser } from "@/lib/mock-data";
import { useTheme, useThemedStyles } from "@/lib/ThemeProvider";
import { FLOATING_TAB_BAR_CLEARANCE } from "@/lib/tabBar";
import { labelStyle, spacing, type Theme } from "@/lib/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Post } from "@/lib/types";

const GRID_GAP = 1;
const GRID_COLS = 2;

function getGridCellSize() {
  const { width } = Dimensions.get("window");
  const horizontalPad = spacing.lg * 2;
  return (width - horizontalPad - GRID_GAP * (GRID_COLS - 1)) / GRID_COLS;
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const userPosts = posts.filter((p) => p.author.id === currentUser.id);
  const cellSize = getGridCellSize();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.lg,
        paddingBottom: FLOATING_TAB_BAR_CLEARANCE + insets.bottom,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.wordmark}>Parcel</Text>

      <View style={styles.storyBlock}>
        <Text style={styles.sectionLabel}>The story</Text>
        <Text style={styles.storyLead}>{currentUser.name}</Text>
        <Text style={styles.storyBody}>
          Your personal agent learns who you are — your interests, rhythm, and intentions — so
          it can represent you with care. Share photos, writing, and moments; let Aria connect
          you through quiet, intentional dialogue.
        </Text>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Text style={styles.metaValue}>{userPosts.length}</Text>
          <Text style={styles.metaLabel}>Posts</Text>
        </View>
        <View style={styles.metaDivider} />
        <View style={styles.metaItem}>
          <Text style={styles.metaValue}>128</Text>
          <Text style={styles.metaLabel}>Connections</Text>
        </View>
      </View>

      <Pressable style={styles.editBtn}>
        <Text style={styles.editBtnText}>Edit profile</Text>
      </Pressable>

      <View style={styles.collectionHeader}>
        <Text style={styles.sectionLabel}>Collection</Text>
        <Text style={styles.collectionSub}>{currentUser.handle}</Text>
      </View>

      <View style={styles.grid}>
        {userPosts.map((post) => (
          <ProfileGridCell key={post.id} post={post} size={cellSize} styles={styles} />
        ))}
      </View>
    </ScrollView>
  );
}

function ProfileGridCell({
  post,
  size,
  styles,
}: {
  post: Post;
  size: number;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <Link href={`/post/${post.id}`} asChild>
      <Pressable style={{ width: size, marginBottom: spacing.lg }}>
        {post.type === "writing" ? (
          <View style={[styles.writingCell, { height: size * 1.15 }]}>
            <Text style={styles.writingCellTitle} numberOfLines={3}>
              {post.title}
            </Text>
          </View>
        ) : (
          <Image source={{ uri: post.imageUrl }} style={[styles.gridImage, { height: size * 1.15 }]} />
        )}
        <Text style={styles.productTitle} numberOfLines={2}>
          {post.title}
        </Text>
        <Text style={styles.productMeta}>
          {post.likes} appreciations · {post.comments.length} notes
        </Text>
      </Pressable>
    </Link>
  );
}

function createStyles({ colors }: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    wordmark: {
      fontSize: 13,
      fontWeight: "500",
      letterSpacing: 3.2,
      textTransform: "uppercase",
      color: colors.text,
      textAlign: "center",
      marginBottom: spacing.xxl,
    },
    storyBlock: {
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.xl,
    },
    sectionLabel: {
      ...labelStyle,
      color: colors.textSecondary,
      marginBottom: spacing.md,
    },
    storyLead: {
      fontSize: 22,
      fontWeight: "500",
      color: colors.text,
      letterSpacing: -0.3,
      marginBottom: spacing.md,
    },
    storyBody: {
      fontSize: 15,
      lineHeight: 24,
      color: colors.textSecondary,
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing.lg,
      gap: spacing.lg,
    },
    metaItem: { alignItems: "center" },
    metaValue: {
      fontSize: 18,
      fontWeight: "500",
      color: colors.text,
    },
    metaLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
      letterSpacing: 0.3,
    },
    metaDivider: {
      width: StyleSheet.hairlineWidth,
      height: 28,
      backgroundColor: colors.border,
    },
    editBtn: {
      marginHorizontal: spacing.lg,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      marginBottom: spacing.xxl,
    },
    editBtnText: {
      fontSize: 13,
      fontWeight: "500",
      letterSpacing: 0.8,
      color: colors.text,
    },
    collectionHeader: {
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.lg,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      paddingTop: spacing.lg,
    },
    collectionSub: {
      fontSize: 14,
      color: colors.textTertiary,
      marginTop: spacing.xs,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingHorizontal: spacing.lg,
      gap: GRID_GAP,
      justifyContent: "space-between",
    },
    gridImage: {
      width: "100%",
      resizeMode: "cover",
      backgroundColor: colors.bgMuted,
    },
    writingCell: {
      width: "100%",
      backgroundColor: colors.bgMuted,
      padding: spacing.md,
      justifyContent: "flex-end",
    },
    writingCellTitle: {
      fontSize: 14,
      fontWeight: "500",
      lineHeight: 20,
      color: colors.text,
    },
    productTitle: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.text,
      marginTop: spacing.sm,
      lineHeight: 19,
    },
    productMeta: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 4,
    },
  });
}
