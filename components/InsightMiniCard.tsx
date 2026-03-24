import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "./Card";

export const InsightMiniCard = ({
  title,
  value,
  sub,
  borderColor,
  iconName,
  iconBg,
}: {
  title: string;
  value: string;
  sub: string;
  borderColor: string;
  iconName?: string;
  iconBg?: string;
}) => {
  return (
    <View style={[styles.wrapper, { borderLeftColor: borderColor }]}>
      <Card style={styles.card}>
        {iconName && (
          <View
            style={[
              styles.iconBox,
              { backgroundColor: iconBg || `${borderColor}20` },
            ]}
          >
            <Ionicons name={iconName as any} size={16} color={borderColor} />
          </View>
        )}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.sub}>{sub}</Text>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 210,
    marginRight: 5,
    borderLeftWidth: 4,
    borderRadius: 18,
    marginLeft: -5,
  },
  card: {
    marginVertical: 0,
    minHeight: 110,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  title: { color: "#64748B", fontSize: 12 },
  value: { fontSize: 20, fontWeight: "700", marginTop: 4 },
  sub: { color: "#64748B", marginTop: 4, fontSize: 12 },
});
