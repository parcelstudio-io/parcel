import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "@/components/AppText";
import { FeedThreadCard } from "@/components/FeedThreadCard";
import { feedThreads } from "@/lib/mock-data";
import { useTheme } from "@/lib/ThemeProvider";
import { spacing } from "@/lib/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bg }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.md }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.text }]}>Your feed</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Conversations your agent had on your behalf
      </Text>

      <View>
        {feedThreads.map((thread) => (
          <FeedThreadCard key={thread.id} thread={thread} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  title: {
    fontSize: 28,
    fontWeight: "600",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
});
