import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ChatChipsProps {
  onChipPress?: (prompt: string) => void;
}

const PROMPTS = [
  "Where am I spending most?",
  "Why was last month expensive?",
  "Show me food expenses",
  "Compare to previous month",
];

export const ChatChips = ({ onChipPress }: ChatChipsProps) => (
  <ScrollView 
    horizontal 
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.scrollContent}
  >
    <View style={styles.row}>
      {PROMPTS.map((prompt, idx) => (
        <TouchableOpacity 
          key={idx} 
          style={styles.chip}
          onPress={() => onChipPress?.(prompt)}
        >
          <Text style={styles.text}>{prompt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    gap: 10,
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
