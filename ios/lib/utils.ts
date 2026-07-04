export const colors = {
  // Airbnb-inspired neutrals
  bg: "#FFFFFF",
  bgMuted: "#F7F7F7",
  text: "#222222",
  textSecondary: "#717171",
  textTertiary: "#B0B0B0",
  border: "#EBEBEB",
  borderLight: "#F0F0F0",

  // Accent (Airbnb coral — sparingly)
  accent: "#FF385C",
  accentSoft: "#FFF0F3",

  // Chat (Claude-like)
  chatBg: "#FFFFFF",
  chatUserBubble: "#F4F4F5",
  chatAgentText: "#1A1A1A",
  chatInputBg: "#FFFFFF",
  chatInputBorder: "#E5E5E5",

  // Legacy aliases (keep imports working)
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

export const shadow = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  input: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
};

export function formatTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
