import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export const SummaryCards = () => (
  <View style={styles.row}>
    <View style={[styles.card, { backgroundColor: colors.primary }]}>
      <Text style={styles.label}>Total Debit</Text>
      <Text style={styles.amountWhite}>$3,240 ↘</Text>
    </View>

    <View style={styles.cardWhite}>
      <Text style={styles.labelDark}>Total Credit</Text>
      <Text style={styles.amountGreen}>$5,350 ↗</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 14 },
  card: {
    flex: 1,
    padding: 18,
    borderRadius: 18,
  },
  cardWhite: {
    flex: 1,
    padding: 18,
    borderRadius: 18,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  label: { color: "#E0E7FF", fontSize: 13 },
  labelDark: { color: "#64748B", fontSize: 13 },
  amountWhite: { color: "#fff", fontSize: 20, fontWeight: "700", marginTop: 8 },
  amountGreen: { color: "#16A34A", fontSize: 20, fontWeight: "700", marginTop: 8 },
});
