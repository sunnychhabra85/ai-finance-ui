import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useDashboard } from "../hooks/useDashboard";
import { colors } from "../theme/colors";

export const SummaryCards = () => {
  const { data, loading, error } = useDashboard();

  if (loading) {
    return (
      <View style={styles.row}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.row}>
        <Text style={{ color: 'red', fontSize: 12 }}>Error: {error}</Text>
      </View>
    );
  }

  const debit = data?.totalDebit || 0;
  const credit = data?.totalCredit || 0;

  return (
    <View style={styles.row}>
      <View style={[styles.card, { backgroundColor: colors.primary }]}>
        <Text style={styles.label}>Total Debit</Text>
        <Text style={styles.amountWhite}>{debit.toLocaleString()} ↘</Text>
      </View>

      <View style={styles.cardWhite}>
        <Text style={styles.labelDark}>Total Credit</Text>
        <Text style={styles.amountGreen}>{credit.toLocaleString()} ↗</Text>
      </View>
    </View>
  );
};

/* STATIC DATA - REPLACED WITH API
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
*/

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
