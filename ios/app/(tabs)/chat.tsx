import { StyleSheet, View } from "react-native";
import { ChatInterface } from "@/components/ChatInterface";
import { useTheme } from "@/lib/ThemeProvider";

export default function ChatScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ChatInterface />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
