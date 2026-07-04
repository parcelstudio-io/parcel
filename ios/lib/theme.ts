import type { ColorScheme } from "@/components/useColorScheme";

export type ThemeColors = {
  bg: string;
  bgMuted: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  borderLight: string;
  accent: string;
  accentSoft: string;
  chatBg: string;
  chatUserBubble: string;
  chatAgentText: string;
  chatInputBg: string;
  chatInputBorder: string;
  buttonPrimary: string;
  buttonPrimaryIcon: string;
  buttonDisabled: string;
  tabBarBg: string;
  headerBg: string;
  shadowColor: string;
  dmSent: string;
  dmReceived: string;
  dmUnread: string;
  // legacy aliases
  white: string;
  stone50: string;
  stone100: string;
  stone200: string;
  stone400: string;
  stone500: string;
  stone600: string;
  stone700: string;
  stone800: string;
  stone900: string;
  brand50: string;
  brand100: string;
  brand600: string;
  brand700: string;
  red500: string;
};

export type ThemeShadow = {
  card: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  input: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
};

export type Theme = {
  scheme: ColorScheme;
  isDark: boolean;
  colors: ThemeColors;
  shadow: ThemeShadow;
};

const lightColors: ThemeColors = {
  bg: "#FFFFFF",
  bgMuted: "#F7F7F7",
  text: "#222222",
  textSecondary: "#717171",
  textTertiary: "#B0B0B0",
  border: "#EBEBEB",
  borderLight: "#F0F0F0",
  accent: "#FF385C",
  accentSoft: "#FFF0F3",
  chatBg: "#FFFFFF",
  chatUserBubble: "#F4F4F5",
  chatAgentText: "#1A1A1A",
  chatInputBg: "#FFFFFF",
  chatInputBorder: "#E5E5E5",
  buttonPrimary: "#222222",
  buttonPrimaryIcon: "#FFFFFF",
  buttonDisabled: "#EBEBEB",
  tabBarBg: "#FFFFFF",
  headerBg: "#FFFFFF",
  shadowColor: "#000000",
  dmSent: "#3797F0",
  dmReceived: "#EFEFEF",
  dmUnread: "#3797F0",
  white: "#FFFFFF",
  stone50: "#F7F7F7",
  stone100: "#F0F0F0",
  stone200: "#EBEBEB",
  stone400: "#B0B0B0",
  stone500: "#717171",
  stone600: "#484848",
  stone700: "#222222",
  stone800: "#1A1A1A",
  stone900: "#222222",
  brand50: "#FFF0F3",
  brand100: "#FFE4EA",
  brand600: "#FF385C",
  brand700: "#E31C5F",
  red500: "#FF385C",
};

const darkColors: ThemeColors = {
  bg: "#0D0D0D",
  bgMuted: "#1A1A1A",
  text: "#F5F5F5",
  textSecondary: "#A3A3A3",
  textTertiary: "#737373",
  border: "#2A2A2A",
  borderLight: "#1F1F1F",
  accent: "#FF5A7A",
  accentSoft: "#2A1520",
  chatBg: "#0D0D0D",
  chatUserBubble: "#2A2A2C",
  chatAgentText: "#EDEDED",
  chatInputBg: "#1A1A1A",
  chatInputBorder: "#333333",
  buttonPrimary: "#F5F5F5",
  buttonPrimaryIcon: "#0D0D0D",
  buttonDisabled: "#333333",
  tabBarBg: "#0D0D0D",
  headerBg: "#0D0D0D",
  shadowColor: "#000000",
  dmSent: "#3797F0",
  dmReceived: "#3A3A3C",
  dmUnread: "#3797F0",
  white: "#F5F5F5",
  stone50: "#1A1A1A",
  stone100: "#1F1F1F",
  stone200: "#2A2A2A",
  stone400: "#737373",
  stone500: "#A3A3A3",
  stone600: "#B8B8B8",
  stone700: "#F5F5F5",
  stone800: "#EDEDED",
  stone900: "#F5F5F5",
  brand50: "#2A1520",
  brand100: "#3D1A28",
  brand600: "#FF5A7A",
  brand700: "#FF5A7A",
  red500: "#FF5A7A",
};

function buildShadow(scheme: ColorScheme, shadowColor: string): ThemeShadow {
  const cardOpacity = scheme === "dark" ? 0.35 : 0.06;
  const inputOpacity = scheme === "dark" ? 0.2 : 0.04;
  return {
    card: {
      shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: cardOpacity,
      shadowRadius: 12,
      elevation: 3,
    },
    input: {
      shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: inputOpacity,
      shadowRadius: 8,
      elevation: 2,
    },
  };
}

export function getTheme(scheme: ColorScheme): Theme {
  const colors = scheme === "dark" ? darkColors : lightColors;
  return {
    scheme,
    isDark: scheme === "dark",
    colors,
    shadow: buildShadow(scheme, colors.shadowColor),
  };
}

/** @deprecated Use useTheme() for dynamic light/dark colors */
export const colors = lightColors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

/** @deprecated Use useTheme().shadow */
export const shadow = buildShadow("light", "#000000");

export function formatTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
