import { StyleSheet, TextInput } from "react-native";
import { colors } from "../theme/colors";

export default function Input(props: any) {
  return (
    <TextInput
      {...props}
      placeholderTextColor={colors.muted}
      style={styles.input}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
});
