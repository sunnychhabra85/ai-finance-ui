import { StyleSheet, Text, View } from "react-native";
import { Card } from "./Card";

export const InsightMiniCard = ({
  title,
  value,
  sub,
  borderColor,
}: {
  title: string;
  value: string;
  sub: string;
  borderColor: string;
}) => {
  return (
    <View style={[styles.wrapper, { borderLeftColor: borderColor }]}>
      <Card style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.sub}>{sub}</Text>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 220,
    marginRight: 5,
    borderLeftWidth: 4,
    borderRadius: 18,
    marginLeft: -5,
  },
  card: {
    marginVertical: 0,
  },
  title: { color: "#64748B", fontSize: 13 },
  value: { fontSize: 20, fontWeight: "700", marginTop: 6 },
  sub: { color: "#64748B", marginTop: 4, fontSize: 12 },
});
