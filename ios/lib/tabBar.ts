import { Platform, StyleSheet } from "react-native";

/** Bottom inset so scroll content clears the floating tab bar. */
export const FLOATING_TAB_BAR_CLEARANCE = 96;

export function getFloatingTabBarStyle(isDark: boolean) {
  return {
    position: "absolute" as const,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  };
}

export const floatingTabBarShadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
  },
  android: { elevation: 12 },
  default: {},
});

export const floatingTabBarPill = {
  borderRadius: 32,
  overflow: "hidden" as const,
  borderWidth: StyleSheet.hairlineWidth,
};
