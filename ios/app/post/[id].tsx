import { useLocalSearchParams } from "expo-router";
import { PostDetail } from "@/components/PostDetail";
import { posts } from "@/lib/mock-data";
import { View, StyleSheet } from "react-native";
import { Text } from "@/components/AppText";
import { useTheme } from "@/lib/ThemeProvider";

export default function PostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.bg }]}>
        <Text style={{ color: colors.text }}>Post not found</Text>
      </View>
    );
  }

  return <PostDetail post={post} />;
}

const styles = StyleSheet.create({
  notFound: { flex: 1, justifyContent: "center", alignItems: "center" },
});
