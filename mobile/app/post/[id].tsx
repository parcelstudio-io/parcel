import { useLocalSearchParams } from "expo-router";
import { PostDetail } from "@/components/PostDetail";
import { posts } from "@/lib/mock-data";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/lib/utils";

export default function PostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <View style={styles.notFound}>
        <Text>Post not found</Text>
      </View>
    );
  }

  return <PostDetail post={post} />;
}

const styles = StyleSheet.create({
  notFound: { flex: 1, justifyContent: "center", alignItems: "center" },
});
