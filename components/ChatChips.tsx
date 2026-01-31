import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const ChatChips = () => (
  <View style={styles.row}>
    <TouchableOpacity style={styles.chip}>
      <Text style={styles.text}>Where am I spending most?</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.chip}>
      <Text style={styles.text}>Why was last month expensive?</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 16,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#C7D2FE",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#F8FAFF",
  },
  text: {
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "600",
  },
});
