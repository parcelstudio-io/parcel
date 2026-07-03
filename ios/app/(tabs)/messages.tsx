import { View, StyleSheet } from "react-native";
import { MessagesView } from "@/components/MessagesView";
import { colors } from "@/lib/utils";

export default function MessagesScreen() {
  return (
    <View style={styles.container}>
      <MessagesView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.stone50, padding: 16 },
});
