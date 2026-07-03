import { View, Text, StyleSheet, ScrollView } from "react-native";
import { PostCard, getCardWidth } from "@/components/PostCard";
import { posts, currentUser } from "@/lib/mock-data";
import { colors } from "@/lib/utils";

export default function HomeScreen() {
  const cardWidth = getCardWidth();
  const leftColumn: typeof posts = [];
  const rightColumn: typeof posts = [];

  posts.forEach((post, i) => {
    if (i % 2 === 0) leftColumn.push(post);
    else rightColumn.push(post);
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{currentUser.name}</Text>
      <Text style={styles.subtitle}>Your photos, writings, and moments</Text>

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
  container: { flex: 1, backgroundColor: colors.stone50 },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 24, fontWeight: "700", color: colors.stone900 },
  subtitle: { fontSize: 15, color: colors.stone500, marginTop: 4, marginBottom: 20 },
  grid: { flexDirection: "row", justifyContent: "space-between" },
  column: { gap: 0 },
});
