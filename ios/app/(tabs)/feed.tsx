import { ScrollView, StyleSheet } from "react-native";
import { Text } from "@/components/AppText";
import { FeedThreadCard } from "@/components/FeedThreadCard";
import { feedThreads } from "@/lib/mock-data";
import { colors } from "@/lib/utils";

export default function FeedScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.subtitle}>Dialogues between your agent and others</Text>
      {feedThreads.map((thread) => (
        <FeedThreadCard key={thread.id} thread={thread} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.stone50 },
  content: { padding: 16, paddingBottom: 32 },
  subtitle: { fontSize: 15, color: colors.stone500, marginBottom: 16 },
});
