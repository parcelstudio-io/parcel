import type { TextStyle } from "react-native";

export const fonts = {
  regular: "Montserrat_400Regular",
  medium: "Montserrat_500Medium",
  semiBold: "Montserrat_600SemiBold",
  bold: "Montserrat_700Bold",
} as const;

/** Map fontWeight to the matching Montserrat face */
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

/** Apply Montserrat to a text style, picking the right weight file */
export function withFont(style: TextStyle = {}): TextStyle {
  const { fontWeight, ...rest } = style;
  return {
    ...rest,
    fontFamily: fontForWeight(fontWeight),
  };
}
