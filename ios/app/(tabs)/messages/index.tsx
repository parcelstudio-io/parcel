import { StyleSheet, View } from "react-native";
import { InboxList } from "@/components/InboxList";
import { useTheme } from "@/lib/ThemeProvider";

export default function InboxScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <InboxList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
