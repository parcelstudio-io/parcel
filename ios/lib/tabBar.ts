export const floatingTabBarPill = {
  borderRadius: 10,
  overflow: "hidden" as const,
  borderWidth: 1,
};

export const floatingTabBarShadow = {
  shadowColor: "#1A1A18",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 4,
};

/** Bottom inset so scroll content clears the floating tab bar. */
export const FLOATING_TAB_BAR_CLEARANCE = 96;

export function getFloatingTabBarStyle(_isDark: boolean) {
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
