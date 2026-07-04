import type { TextStyle } from "react-native";

export const fonts = {
  regular: "Jost_400Regular",
  medium: "Jost_500Medium",
  semiBold: "Jost_600SemiBold",
  bold: "Jost_700Bold",
} as const;

export function fontForWeight(
  weight?: TextStyle["fontWeight"]
): (typeof fonts)[keyof typeof fonts] {
  switch (weight) {
    case "500":
    case 500:
    case "medium":
      return fonts.medium;
    case "600":
    case 600:
    case "semibold":
      return fonts.semiBold;
    case "700":
    case 700:
    case "bold":
      return fonts.bold;
    default:
      return fonts.regular;
  }
}

export function withFont(style: TextStyle = {}): TextStyle {
  const { fontWeight, ...rest } = style;
  return {
    ...rest,
    fontFamily: fontForWeight(fontWeight),
  };
}
