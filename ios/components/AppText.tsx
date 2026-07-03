import {
  Text as RNText,
  TextInput as RNTextInput,
  type TextProps,
  type TextInputProps,
  StyleSheet,
} from "react-native";
import { withFont } from "@/lib/typography";

export function Text({ style, ...props }: TextProps) {
  const flat = StyleSheet.flatten(style) ?? {};
  return <RNText style={withFont(flat)} {...props} />;
}

export function TextInput({ style, ...props }: TextInputProps) {
  const flat = StyleSheet.flatten(style) ?? {};
  return <RNTextInput style={withFont(flat)} {...props} />;
}
