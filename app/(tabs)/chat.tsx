import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { ChatBubble } from "../../components/ChatBubble";
import { ChatChips } from "../../components/ChatChips";
import { colors } from "../../theme/colors";

export default function Chat() {
  return (
    <View style={styles.container}>
      {/* TOP CONTENT */}
      <View>
        <View style={styles.headerRow}>
          <View style={styles.botIcon}>
            <Text style={{ color: "#fff", fontWeight: "700" }}>🤖</Text>
          </View>
          <View>
            <Text style={styles.title}>AI Assistant</Text>
            <Text style={styles.online}>● Online</Text>
          </View>
          
        </View>

        <ChatBubble text="Hi! I'm your personal spending assistant. Ask me anything about your finances!" />
      </View>

      {/* BOTTOM AREA */}
      <View style={styles.bottomArea}>
        <ChatChips />

        <View style={styles.inputBar}>
          <TextInput
            placeholder="Ask about your spending..."
            style={{ flex: 1 }}
          />
          <Text style={styles.send}>➤</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.background,
    justifyContent: "space-between",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  botIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  online: {
    color: "#22C55E",
    fontSize: 12,
    marginTop: 2,
  },

  bottomArea: {
    marginBottom: 10,
  },

  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 52,
    marginTop: 12,
  },

  send: {
    color: "#2563EB",
    fontSize: 18,
    marginLeft: 10,
  },
});
