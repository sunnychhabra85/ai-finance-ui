import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../theme/colors";

export const Segment = ({ tab, setTab }: any) => {
  return (
    <View style={styles.container}>
      {["Transactions", "Insights"].map((item) => (
        <TouchableOpacity
          key={item}
          onPress={() => setTab(item)}
          style={[
            styles.tab,
            tab === item && { backgroundColor: "#fff", elevation: 4 },
          ]}
        >
          <Text
            style={[
              styles.text,
              tab === item && { color: colors.textDark, fontWeight: "600" },
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
  container: {
    flexDirection: "row",
    backgroundColor: "#EEF2F6",
    borderRadius: 14,
    padding: 4,
    marginVertical: 18,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 12,
  },
  text: { color: "#64748B" },
});
