import { View, StyleSheet, ScrollView, Pressable, Image, Dimensions } from "react-native";
import { Text } from "@/components/AppText";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Avatar } from "@/components/Avatar";
import { posts, currentUser } from "@/lib/mock-data";
import { useTheme, useThemedStyles } from "@/lib/ThemeProvider";
import { FLOATING_TAB_BAR_CLEARANCE } from "@/lib/tabBar";
import { spacing, type Theme } from "@/lib/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Post } from "@/lib/types";

const GRID_GAP = 2;
const GRID_COLS = 3;

function getGridCellSize() {
  const { width } = Dimensions.get("window");
  return (width - GRID_GAP * (GRID_COLS - 1)) / GRID_COLS;
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const userPosts = posts.filter((p) => p.author.id === currentUser.id);
  const cellSize = getGridCellSize();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bg }]}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.sm,
        paddingBottom: FLOATING_TAB_BAR_CLEARANCE + insets.bottom,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <Text style={styles.username}>{currentUser.handle.replace("@", "")}</Text>
        <Pressable hitSlop={12} accessibilityLabel="Menu">
          <Ionicons name="menu-outline" size={26} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.headerRow}>
        <Avatar user={currentUser} size={86} />
        <View style={styles.stats}>
          <StatItem value={userPosts.length} label="Posts" styles={styles} />
          <StatItem value={128} label="Followers" styles={styles} />
          <StatItem value={96} label="Following" styles={styles} />
        </View>
      </View>

      <View style={styles.bioBlock}>
        <Text style={styles.displayName}>{currentUser.name}</Text>
        <Text style={styles.bio}>
          Building Parcel · trail runner · sharing photos, writing, and life through my agent Aria.
        </Text>
      </View>

      <Pressable style={styles.editBtn}>
        <Text style={styles.editBtnText}>Edit profile</Text>
      </Pressable>

      <View style={styles.gridTabs}>
        <Ionicons name="grid" size={22} color={colors.text} />
        <View style={styles.gridTabSpacer} />
        <Ionicons name="bookmark-outline" size={22} color={colors.textTertiary} />
      </View>

      <View style={styles.grid}>
        {userPosts.map((post) => (
          <ProfileGridCell key={post.id} post={post} size={cellSize} styles={styles} />
        ))}
      </View>
    </ScrollView>
  );
}

function StatItem({
  value,
  label,
  styles,
}: {
  value: number;
  label: string;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
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
  const { colors } = useTheme();

  return (
    <Link href={`/post/${post.id}`} asChild>
      <Pressable style={[styles.gridCell, { width: size, height: size }]}>
        {post.type === "writing" ? (
          <View style={styles.writingCell}>
            <Ionicons name="document-text-outline" size={22} color={colors.textSecondary} />
            <Text style={styles.writingCellTitle} numberOfLines={2}>
              {post.title}
            </Text>
          </View>
        ) : (
          <>
            <Image source={{ uri: post.imageUrl }} style={styles.gridImage} />
            {post.type === "video" && (
              <View style={styles.videoBadge}>
                <Ionicons name="play" size={14} color="#FFFFFF" />
              </View>
            )}
          </>
        )}
      </Pressable>
    </Link>
  );
}

function createStyles({ colors }: Theme) {
  return StyleSheet.create({
    container: { flex: 1 },
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.md,
    },
    username: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
      letterSpacing: -0.3,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      gap: spacing.lg,
      marginBottom: spacing.md,
    },
    stats: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-around",
    },
    statItem: { alignItems: "center" },
    statValue: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    statLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 2,
    },
    bioBlock: {
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.md,
    },
    displayName: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    bio: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.text,
    },
    editBtn: {
      marginHorizontal: spacing.lg,
      paddingVertical: 8,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      marginBottom: spacing.md,
    },
    editBtnText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    gridTabs: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderTopWidth: StyleSheet.hairlineWidth,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderLight,
      paddingVertical: spacing.sm,
      marginBottom: GRID_GAP,
    },
    gridTabSpacer: { width: 48 },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: GRID_GAP,
    },
    gridCell: {
      backgroundColor: colors.bgMuted,
      overflow: "hidden",
    },
    gridImage: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    writingCell: {
      flex: 1,
      padding: spacing.sm,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.bgMuted,
    },
    writingCellTitle: {
      fontSize: 11,
      fontWeight: "600",
      color: colors.text,
      textAlign: "center",
      marginTop: spacing.xs,
    },
    videoBadge: {
      position: "absolute",
      top: 8,
      right: 8,
    },
  });
}
