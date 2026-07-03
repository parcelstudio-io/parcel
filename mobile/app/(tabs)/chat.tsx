import { View, Text, StyleSheet } from "react-native";
import { ChatInterface } from "@/components/ChatInterface";
import { colors } from "@/lib/utils";

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Chat with Aria to share more about yourself</Text>
      <ChatInterface />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.stone50, padding: 16 },
  subtitle: { fontSize: 15, color: colors.stone500, marginBottom: 12 },
});
