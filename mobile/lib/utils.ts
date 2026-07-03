export const colors = {
  brand50: "#f0fdf4",
  brand100: "#dcfce7",
  brand600: "#16a34a",
  brand700: "#15803d",
  stone50: "#fafaf9",
  stone100: "#f5f5f4",
  stone200: "#e7e5e4",
  stone400: "#a8a29e",
  stone500: "#78716c",
  stone600: "#57534e",
  stone700: "#44403c",
  stone800: "#292524",
  stone900: "#1c1917",
  white: "#ffffff",
  red500: "#ef4444",
};

export function formatTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
