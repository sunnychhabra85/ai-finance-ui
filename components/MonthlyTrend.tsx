import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";
import { Card } from "./Card";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

type TrendPoint = {
  month: string;
  amount: number;
};

const FALLBACK_VALUES = [2500, 1700, 3100, 2800, 2300, 3400];

const toPath = (points: { x: number; y: number }[]) => {
  if (points.length === 0) return "";
  return points.reduce(
    (acc, p, index) => `${acc}${index === 0 ? "M" : " L"}${p.x} ${p.y}`,
    ""
  );
};

export const MonthlyTrend = ({
  data,
  totalDebit,
}: {
  data?: TrendPoint[];
  totalDebit?: number;
}) => {
  const normalized =
    data && data.length > 0
      ? MONTHS.map((month, idx) => {
          const found = data.find(
            (point) => point.month.slice(0, 3).toLowerCase() === month.toLowerCase()
          );
          if (found) return found.amount;

          const fallbackBase = totalDebit && totalDebit > 0 ? totalDebit / 6 : 2200;
          return Math.max(300, fallbackBase * (0.75 + idx * 0.06));
        })
      : FALLBACK_VALUES;

  const chartW = 260;
  const chartH = 130;
  const maxData = Math.max(...normalized, 3600);
  const maxVal = Math.ceil(maxData / 900) * 900;
  const ticks = [0, maxVal * 0.25, maxVal * 0.5, maxVal * 0.75, maxVal].map((v) =>
    Math.round(v)
  );

  const points = normalized.map((val, idx) => {
    const x = (idx * chartW) / (normalized.length - 1);
    const ratio = val / (maxVal || 1);
    const y = chartH - ratio * chartH;
    return { x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) };
  });

  const linePath = toPath(points);
  const areaPath = `${linePath} L ${chartW} ${chartH} L 0 ${chartH} Z`;

  return (
    <Card style={{ marginTop: 18 }}>
      <Text style={styles.title}>Monthly Trend</Text>

      <View style={styles.chartRow}>
        <View style={styles.yAxis}>
          {[...ticks].reverse().map((tick) => (
            <Text key={tick} style={styles.yTick}>
              {tick}
            </Text>
          ))}
        </View>

        <View style={styles.chartArea}>
          <Svg
            height={chartH}
            width="100%"
            viewBox={`0 0 ${chartW} ${chartH}`}
            preserveAspectRatio="none"
          >
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#2563EB" stopOpacity="0.35" />
                <Stop offset="1" stopColor="#2563EB" stopOpacity="0.02" />
              </LinearGradient>
            </Defs>

            {ticks.map((tick) => {
              const y = chartH - (tick / (maxVal || 1)) * chartH;
              return (
                <Path
                  key={`grid-${tick}`}
                  d={`M 0 ${y.toFixed(2)} L ${chartW} ${y.toFixed(2)}`}
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
              );
            })}

            <Path d={areaPath} fill="url(#grad)" />
            <Path d={linePath} stroke="#2563EB" strokeWidth="2.5" fill="none" />
          </Svg>
        </View>
      </View>

      <View style={styles.labels}>
        {MONTHS.map((m) => (
          <Text key={m} style={styles.label}>
            {m}
          </Text>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  title: { fontWeight: "600", marginBottom: 12 },
  chartRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  yAxis: {
    width: 34,
    justifyContent: "space-between",
    marginRight: 6,
  },
  yTick: {
    color: "#94A3B8",
    fontSize: 10,
  },
  chartArea: {
    flex: 1,
    minHeight: 130,
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginLeft: 40,
  },
  label: { color: "#64748B", fontSize: 11 },
});
