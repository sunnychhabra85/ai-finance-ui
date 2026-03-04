import { StyleSheet, Text, View } from "react-native";

interface ChatBubbleProps {
  text: string;
  isUser?: boolean;
}

export const ChatBubble = ({ text, isUser = false }: ChatBubbleProps) => {
  return (
    <View style={[styles.row, isUser && styles.rowReverse]}>
      {!isUser && (
        <View style={styles.icon}>
          <Text style={{ color: "#2563EB", fontWeight: "700" }}>✦</Text>
        </View>
      )}

      <View style={[styles.bubble, isUser && styles.bubbleUser]}>
        <Text style={[styles.text, isUser && styles.textUser]}>{text}</Text>
      </View>

      {isUser && (
        <View style={styles.iconUser}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>👤</Text>
        </View>
      )}
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
  rowReverse: {
    flexDirection: "row-reverse",
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
  },
  iconUser: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2563EB",
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
  bubbleUser: {
    backgroundColor: "#EEF4FF",
    borderColor: "#C7D2FE",
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  textUser: {
    color: "#1E40AF",
  },
});
