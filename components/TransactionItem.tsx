import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { Card } from "./Card";

export const TransactionItem = ({ title, date, amount }: any) => (
  <Card>
    <View style={styles.row}>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <Text
        style={[
          styles.amount,
          { color: amount.startsWith("+") ? "green" : "#111" },
        ]}
      >
        {amount}
      </Text>
    </View>
  </Card>
);

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between" },
  title: { fontWeight: "600", fontSize: 15 },
  date: { color: colors.textLight, marginTop: 4 },
  amount: { fontWeight: "700", fontSize: 16 },
});
