import { View, StyleSheet, ScrollView } from "react-native";
import { Text } from "@/components/AppText";
import { PostCard, getCardWidth } from "@/components/PostCard";
import { posts, currentUser } from "@/lib/mock-data";
import { useTheme } from "@/lib/ThemeProvider";
import { spacing } from "@/lib/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const cardWidth = getCardWidth();
  const leftColumn: typeof posts = [];
  const rightColumn: typeof posts = [];

  posts.forEach((post, i) => {
    if (i % 2 === 0) leftColumn.push(post);
    else rightColumn.push(post);
  });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bg }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.md }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.greeting, { color: colors.text }]}>
        Hello, {currentUser.name.split(" ")[0]}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Your moments & writings
      </Text>

      <View style={styles.grid}>
        <View style={[styles.column, { width: cardWidth }]}>
          {leftColumn.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </View>
        <View style={[styles.column, { width: cardWidth }]}>
          {rightColumn.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  greeting: {
    fontSize: 28,
    fontWeight: "600",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  grid: { flexDirection: "row", justifyContent: "space-between" },
  column: {},
});
