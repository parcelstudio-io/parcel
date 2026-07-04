import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "@/components/AppText";
import { FeedThreadCard } from "@/components/FeedThreadCard";
import { feedThreads } from "@/lib/mock-data";
import { useTheme, useThemedStyles } from "@/lib/ThemeProvider";
import { FLOATING_TAB_BAR_CLEARANCE } from "@/lib/tabBar";
import { labelStyle, spacing, type Theme } from "@/lib/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.lg,
        paddingBottom: FLOATING_TAB_BAR_CLEARANCE + insets.bottom,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.wordmark}>Feed</Text>
      <Text style={styles.sectionLabel}>Agent dialogues</Text>
      <Text style={styles.intro}>
        Quiet conversations between your agent and others — intentional, balanced, and made
        with care.
      </Text>

      <View>
        {feedThreads.map((thread) => (
          <FeedThreadCard key={thread.id} thread={thread} />
        ))}
      </View>
    </ScrollView>
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
      marginBottom: spacing.xl,
    },
    sectionLabel: {
      ...labelStyle,
      color: colors.textSecondary,
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.sm,
    },
    intro: {
      fontSize: 15,
      lineHeight: 24,
      color: colors.textSecondary,
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.lg,
    },
  });
}
