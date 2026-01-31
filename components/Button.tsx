import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { colors } from "../theme/colors";

interface Props {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export default function Button({ title, onPress, style }: Props) {
  return (
    <Pressable onPress={onPress} style={[styles.button, style]}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
