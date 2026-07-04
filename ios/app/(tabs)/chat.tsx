import { StyleSheet, View } from "react-native";
import { ChatInterface } from "@/components/ChatInterface";
import { colors } from "@/lib/utils";

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      <ChatInterface />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
});
