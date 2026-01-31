import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../theme/colors";

const items = ["All", "Food", "Travel", "Bills", "Income"];

export const Chips = ({ selected, onSelect }: any) => {
  const items = ["All", "Food", "Travel", "Bills", "Income"];

  return (
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
  );
};


const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 10, marginVertical: 14 },
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
