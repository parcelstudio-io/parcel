import { Stack } from "expo-router";
import { colors } from "@/lib/utils";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="post/[id]"
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: colors.white },
          headerTintColor: colors.brand600,
        }}
      />
    </Stack>
  );
}
