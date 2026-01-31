import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";
import { Card } from "./Card";

export const MonthlyTrend = () => {
  return (
    <Card style={{ marginTop: 18 }}>
      <Text style={styles.title}>Monthly Trend</Text>

      <Svg height="160" width="100%" viewBox="0 0 300 160">
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#2563EB" stopOpacity="0.4" />
            <Stop offset="1" stopColor="#2563EB" stopOpacity="0" />
          </LinearGradient>
        </Defs>

        <Path
          d="M0 120 C40 80, 80 140, 120 70 S200 100, 240 90 S280 40, 300 50"
          stroke="#2563EB"
          strokeWidth="3"
          fill="url(#grad)"
        />
      </Svg>

      <View style={styles.labels}>
        {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => (
          <Text key={m} style={styles.label}>{m}</Text>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  title: { fontWeight: "600", marginBottom: 10 },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    marginTop: 6,
  },
  label: { color: "#64748B", fontSize: 12 },
});
