import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Text } from "@/components/AppText";
import { useThemedStyles } from "@/lib/ThemeProvider";
import { spacing, type Theme } from "@/lib/theme";

export default function NotFoundScreen() {
  const styles = useThemedStyles(createStyles);

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

function createStyles({ colors }: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      backgroundColor: colors.bg,
    },
    title: { fontSize: 20, fontWeight: "600", color: colors.text },
    link: { marginTop: 15, paddingVertical: 15 },
    linkText: { fontSize: 14, color: colors.accent },
  });
}
