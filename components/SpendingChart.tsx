import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface Props {
  data: { label: string; value: number }[];
}

export default function SpendingChart({ data }: Props) {
  const radius = 60;
  const stroke = 14;
  const circumference = 2 * Math.PI * radius;

  return (
    <View style={styles.container}>
      <Svg width={160} height={160}>
        <Circle
          cx="80"
          cy="80"
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx="80"
          cy="80"
          r={radius}
          stroke="#000"
          strokeWidth={stroke}
          strokeDasharray={`${circumference * 0.75} ${circumference}`}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>

      <View style={styles.center}>
        <Text style={styles.amount}>$1,550</Text>
        <Text style={styles.label}>Total</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 24,
  },
  center: {
    position: "absolute",
    alignItems: "center",
    top: 64,
  },
  amount: {
    fontSize: 22,
    fontWeight: "700",
  },
  label: {
    color: "#6B7280",
    fontSize: 12,
  },
});
