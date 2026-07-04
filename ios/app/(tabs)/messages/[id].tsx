import { useCallback, useEffect } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { useLocalSearchParams, router, useNavigation } from "expo-router";
import { ConversationView } from "@/components/ConversationView";
import { conversations } from "@/lib/mock-data";
import { useTheme } from "@/lib/ThemeProvider";
import { Text } from "@/components/AppText";

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const conversation = conversations.find((c) => c.id === id);

  useEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => {
      parent?.setOptions({ tabBarStyle: undefined });
    };
  }, [navigation]);

  if (!conversation) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.bg }]}>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: colors.text }}>Conversation not found</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ConversationView conversation={conversation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
});
