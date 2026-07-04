import { View, Pressable, StyleSheet } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/lib/ThemeProvider";
import { floatingTabBarPill, floatingTabBarShadow } from "@/lib/tabBar";

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const pillBackground = isDark ? "rgba(20, 20, 18, 0.94)" : "rgba(250, 249, 246, 0.94)";
  const pillBorder = isDark ? "rgba(245, 244, 240, 0.1)" : "rgba(26, 26, 24, 0.1)";

  return (
    <View
      style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 10) }]}
      pointerEvents="box-none"
    >
      <View style={[styles.shadowWrap, floatingTabBarShadow]}>
        <View
          style={[
            styles.pill,
            floatingTabBarPill,
            {
              backgroundColor: pillBackground,
              borderColor: pillBorder,
            },
          ]}
        >
          <View style={styles.row}>
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const isFocused = state.index === index;

              const onPress = () => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name, route.params);
                }
              };

              const onLongPress = () => {
                navigation.emit({ type: "tabLongPress", target: route.key });
              };

              const color = isFocused ? colors.text : colors.textTertiary;
              const icon =
                options.tabBarIcon?.({
                  focused: isFocused,
                  color,
                  size: 22,
                }) ?? null;

              return (
                <Pressable
                  key={route.key}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel ?? options.title}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={({ pressed }) => [styles.tab, pressed && styles.tabPressed]}
                >
                  {icon}
                  {isFocused ? <View style={[styles.dot, { backgroundColor: colors.text }]} /> : null}
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
  },
  shadowWrap: {
    width: "100%",
    maxWidth: 400,
    paddingHorizontal: 24,
  },
  pill: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 4,
    paddingVertical: 8,
    minHeight: 52,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    gap: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  tabPressed: {
    opacity: 0.5,
  },
});
