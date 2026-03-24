import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

export const DONUT_COLORS = [
  "#2563EB",
  "#FB923C",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

const FALLBACK_CATEGORIES = [
  { name: "Food", percentage: 32 },
  { name: "Travel", percentage: 19 },
  { name: "Shopping", percentage: 24 },
  { name: "Bills", percentage: 14 },
  { name: "Entertainment", percentage: 11 },
];

type DonutCategory = { name: string; percentage: number; amount?: number };

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function buildArcPath(
  cx: number,
  cy: number,
  R: number,
  ir: number,
  startDeg: number,
  endDeg: number
): string {
  const gap = 1.5;
  const s = polarToCartesian(cx, cy, R, startDeg + gap);
  const e = polarToCartesian(cx, cy, R, endDeg - gap);
  const si = polarToCartesian(cx, cy, ir, startDeg + gap);
  const ei = polarToCartesian(cx, cy, ir, endDeg - gap);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${s.x.toFixed(2)} ${s.y.toFixed(2)}`,
    `A ${R} ${R} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`,
    `L ${ei.x.toFixed(2)} ${ei.y.toFixed(2)}`,
    `A ${ir} ${ir} 0 ${large} 0 ${si.x.toFixed(2)} ${si.y.toFixed(2)}`,
    "Z",
  ].join(" ");
}

export const Donut = ({
  categories,
  total,
}: {
  categories?: DonutCategory[];
  total?: number;
}) => {
  const data =
    categories && categories.length > 0 ? categories : FALLBACK_CATEGORIES;
  const CX = 90,
    CY = 90,
    R = 70,
    IR = 46;
  let angle = 0;

  return (
    <View style={styles.wrapper}>
      <Svg width={180} height={180} viewBox="0 0 180 180">
        {data.map((cat, i) => {
          const sweep = (cat.percentage / 100) * 360;
          const d = buildArcPath(CX, CY, R, IR, angle, angle + sweep);
          angle += sweep;
          return (
            <Path
              key={cat.name}
              d={d}
              fill={DONUT_COLORS[i % DONUT_COLORS.length]}
            />
          );
        })}
      </Svg>
      <View style={styles.centerOverlay} pointerEvents="none">
        {total !== undefined && total > 0 ? (
          <>
            <Text style={styles.totalText}>{total.toLocaleString()}</Text>
            <Text style={styles.totalLabel}>Total</Text>
          </>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  centerOverlay: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  totalText: { fontWeight: "700", fontSize: 20, color: "#0F172A" },
  totalLabel: { color: "#64748B", fontSize: 12, marginTop: 2 },
});
