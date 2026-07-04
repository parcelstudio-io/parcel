import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/components/AppText";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import type { Conversation } from "@/lib/types";
import { Avatar } from "@/components/Avatar";
import { conversations, currentUser } from "@/lib/mock-data";
import { useTheme, useThemedStyles } from "@/lib/ThemeProvider";
import { spacing, type Theme } from "@/lib/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function InboxList() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{currentUser.handle.replace("@", "")}</Text>
        <Pressable hitSlop={12} accessibilityLabel="New message">
          <Ionicons name="create-outline" size={26} color={colors.text} />
        </Pressable>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.md }}
        renderItem={({ item }) => (
          <ConversationRow
            conversation={item}
            onPress={() => router.push(`/messages/${item.id}`)}
            styles={styles}
          />
        )}
      />
    </View>
  );
}

function ConversationRow({
  conversation,
  onPress,
  styles,
}: {
  conversation: Conversation;
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
}) {
  const unread = conversation.unread > 0;
  const firstName = conversation.participant.name.split(" ")[0];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <View style={styles.avatarWrap}>
        <Avatar user={conversation.participant} size={56} />
        {unread ? <View style={styles.unreadDot} /> : null}
      </View>
      <View style={styles.rowContent}>
        <View style={styles.rowTop}>
          <Text style={[styles.rowName, unread && styles.rowNameUnread]} numberOfLines={1}>
            {firstName}
          </Text>
          <Text style={styles.rowTime}>{conversation.lastMessageTime}</Text>
        </View>
        <Text
          style={[styles.rowPreview, unread && styles.rowPreviewUnread]}
          numberOfLines={1}
        >
          {conversation.lastMessage}
        </Text>
      </View>
    </Pressable>
  );
}

function createStyles({ colors }: Theme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.bg },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
      paddingBottom: spacing.md,
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
      letterSpacing: -0.3,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.md,
      paddingVertical: 10,
      gap: spacing.md,
    },
    rowPressed: {
      backgroundColor: colors.bgMuted,
    },
    avatarWrap: {
      position: "relative",
    },
    unreadDot: {
      position: "absolute",
      bottom: 2,
      right: 2,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.dmUnread,
      borderWidth: 2,
      borderColor: colors.bg,
    },
    rowContent: {
      flex: 1,
      minWidth: 0,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderLight,
      paddingBottom: 12,
    },
    rowTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm,
      marginBottom: 2,
    },
    rowName: {
      flex: 1,
      fontSize: 16,
      fontWeight: "400",
      color: colors.text,
    },
    rowNameUnread: {
      fontWeight: "700",
    },
    rowTime: {
      fontSize: 13,
      color: colors.textTertiary,
    },
    rowPreview: {
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    rowPreviewUnread: {
      color: colors.text,
      fontWeight: "500",
    },
  });
}
