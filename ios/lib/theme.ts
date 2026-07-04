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

/** Maru Coffee–inspired: warm paper, charcoal type, minimal contrast accents */
const lightColors: ThemeColors = {
  bg: "#FAF9F6",
  bgMuted: "#F2F0EB",
  text: "#1A1A18",
  textSecondary: "#6E6E68",
  textTertiary: "#A8A8A0",
  border: "#E5E2DA",
  borderLight: "#EDEBE4",
  accent: "#1A1A18",
  accentSoft: "#F2F0EB",
  chatBg: "#FAF9F6",
  chatUserBubble: "#EDEAE3",
  chatAgentText: "#1A1A18",
  chatInputBg: "#FAF9F6",
  chatInputBorder: "#E5E2DA",
  buttonPrimary: "#1A1A18",
  buttonPrimaryIcon: "#FAF9F6",
  buttonDisabled: "#D8D5CD",
  tabBarBg: "#FAF9F6",
  headerBg: "#FAF9F6",
  shadowColor: "#1A1A18",
  dmSent: "#1A1A18",
  dmReceived: "#F2F0EB",
  dmUnread: "#1A1A18",
  white: "#FAF9F6",
  stone50: "#F2F0EB",
  stone100: "#EDEBE4",
  stone200: "#E5E2DA",
  stone400: "#A8A8A0",
  stone500: "#6E6E68",
  stone600: "#4A4A46",
  stone700: "#1A1A18",
  stone800: "#141412",
  stone900: "#1A1A18",
  brand50: "#F2F0EB",
  brand100: "#EDEAE3",
  brand600: "#1A1A18",
  brand700: "#141412",
  red500: "#1A1A18",
};

const darkColors: ThemeColors = {
  bg: "#141412",
  bgMuted: "#1E1E1C",
  text: "#F5F4F0",
  textSecondary: "#A8A8A0",
  textTertiary: "#737370",
  border: "#2E2E2A",
  borderLight: "#252522",
  accent: "#F5F4F0",
  accentSoft: "#1E1E1C",
  chatBg: "#141412",
  chatUserBubble: "#2A2A28",
  chatAgentText: "#F5F4F0",
  chatInputBg: "#141412",
  chatInputBorder: "#2E2E2A",
  buttonPrimary: "#F5F4F0",
  buttonPrimaryIcon: "#141412",
  buttonDisabled: "#3A3A36",
  tabBarBg: "#141412",
  headerBg: "#141412",
  shadowColor: "#000000",
  dmSent: "#F5F4F0",
  dmReceived: "#2A2A28",
  dmUnread: "#F5F4F0",
  white: "#F5F4F0",
  stone50: "#1E1E1C",
  stone100: "#252522",
  stone200: "#2E2E2A",
  stone400: "#737370",
  stone500: "#A8A8A0",
  stone600: "#C4C4BE",
  stone700: "#F5F4F0",
  stone800: "#FAF9F6",
  stone900: "#F5F4F0",
  brand50: "#1E1E1C",
  brand100: "#2A2A28",
  brand600: "#F5F4F0",
  brand700: "#FAF9F6",
  red500: "#F5F4F0",
};

function buildShadow(scheme: ColorScheme, shadowColor: string): ThemeShadow {
  const cardOpacity = scheme === "dark" ? 0.2 : 0.04;
  const inputOpacity = scheme === "dark" ? 0.12 : 0.02;
  return {
    card: {
      shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: cardOpacity,
      shadowRadius: 4,
      elevation: 1,
    },
    input: {
      shadowColor,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: inputOpacity,
      shadowRadius: 0,
      elevation: 0,
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
  xxl: 48,
};

export const radius = {
  sm: 2,
  md: 4,
  lg: 6,
  xl: 8,
  pill: 999,
};

/** Editorial label style (Maru-style small caps) */
export const labelStyle = {
  fontSize: 11,
  fontWeight: "500" as const,
  letterSpacing: 1.6,
  textTransform: "uppercase" as const,
};

/** @deprecated Use useTheme().shadow */
export const shadow = buildShadow("light", "#1A1A18");

export function formatTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
