import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "@/components/AppText";
import { FeedThreadCard } from "@/components/FeedThreadCard";
import { feedThreads } from "@/lib/mock-data";
import { colors, spacing } from "@/lib/utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FeedScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.md }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Your feed</Text>
      <Text style={styles.subtitle}>Conversations your agent had on your behalf</Text>

      <View style={styles.list}>
        {feedThreads.map((thread) => (
          <FeedThreadCard key={thread.id} thread={thread} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  list: {},
});
