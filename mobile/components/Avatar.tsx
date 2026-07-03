import { Image, StyleSheet, View } from "react-native";
import type { User } from "@/lib/types";

type AvatarProps = {
  user: User;
  size?: number;
};

export function Avatar({ user, size = 40 }: AvatarProps) {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      <Image
        source={{ uri: user.avatar.replace("/svg?", "/png?") }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e7e5e4",
    overflow: "hidden",
  },
});
