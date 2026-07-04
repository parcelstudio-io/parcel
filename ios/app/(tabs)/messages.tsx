import { StyleSheet, View } from "react-native";
import { MessagesView } from "@/components/MessagesView";
import { useTheme } from "@/lib/ThemeProvider";

export default function MessagesScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <MessagesView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
