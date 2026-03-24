import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../theme/colors";

interface ChipsProps {
  selected: string;
  onSelect: (category: string) => void;
  categories?: string[];
}

export const Chips = ({ selected, onSelect, categories = [] }: ChipsProps) => {
  const items = ["All", ...categories];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.row}>
        {items.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => onSelect(item)}
            style={[
              styles.chip,
              selected === item && styles.active,
            ]}
          >
            <Text
              style={[
                styles.text,
                selected === item && styles.activeText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: 14,
  },
  row: { flexDirection: "row", gap: 10 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  active: { backgroundColor: colors.primary, borderColor: colors.primary },
  text: { color: colors.textDark },
  activeText: { color: "#fff" },
});
