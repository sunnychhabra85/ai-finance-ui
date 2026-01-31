import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";
import { colors } from "../theme/colors";

export const SearchBar = ({ value, onChange }: any) => (
  <View style={styles.container}>
    <Ionicons name="search" size={18} color={colors.textLight} />
    <TextInput
      placeholder="Search..."
      style={styles.input}
      value={value}
      onChangeText={onChange}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
  },
  input: { flex: 1 },
});
