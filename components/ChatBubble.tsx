import { StyleSheet, Text, View } from "react-native";

export const ChatBubble = ({ text }: { text: string }) => {
  return (
    <View style={styles.row}>
      <View style={styles.icon}>
        <Text style={{ color: "#2563EB", fontWeight: "700" }}>✦</Text>
      </View>

      <View style={styles.bubble}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 20,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
  },
  bubble: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
});
