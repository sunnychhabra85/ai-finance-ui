import React from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useDashboard } from "../hooks/useDashboard";
import { Card } from "./Card";
import { DONUT_COLORS, Donut } from "./Donut";
import { InsightMiniCard } from "./InsightMiniCard";
import { MonthlyTrend } from "./MonthlyTrend";

const FALLBACK_CATS = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Entertainment",
];

const formatMoney = (value: number) => `${Math.abs(value).toLocaleString()}`;

const formatMonthLabel = (rawMonth: string) => {
  if (!rawMonth) return "";

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const trimmed = rawMonth.trim();
  const ymMatch = trimmed.match(/^(\d{4})-(\d{2})$/);
  if (ymMatch) {
    const year = ymMatch[1];
    const monthIndex = Number(ymMatch[2]) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${monthNames[monthIndex]}-${year}`;
    }
  }

  const date = new Date(trimmed);
  if (!Number.isNaN(date.getTime())) {
    return `${monthNames[date.getMonth()]}-${date.getFullYear()}`;
  }

  return trimmed;
};

const isSameMonthRef = (left: string, right: string) =>
  formatMonthLabel(left).toLowerCase() === formatMonthLabel(right).toLowerCase();

export const InsightsBlock = () => {
  const { data, loading } = useDashboard();

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#2563EB"
        style={{ marginTop: 40 }}
      />
    );
  }

  const categories =
    data?.categories && data.categories.length > 0
      ? data.categories
      : FALLBACK_CATS.map((name) => ({ name, percentage: 20, amount: 0 }));

  const categoriesAmountTotal = categories.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );
  const normalizedCategories = categories.map((item) => ({
    ...item,
    percentage:
      item.percentage ||
      (categoriesAmountTotal > 0
        ? Number(((item.amount / categoriesAmountTotal) * 100).toFixed(1))
        : 0),
  }));

  const totalDebit = data?.totalDebit || categoriesAmountTotal;
  const trend = data?.monthlyTrend || [];

  const highestCategory = [...normalizedCategories].sort(
    (a, b) => (b.percentage || 0) - (a.percentage || 0)
  )[0];

  const highestMonthFromTrend =
    trend.length > 0
      ? trend.reduce((max, current) =>
          current.amount > max.amount ? current : max
        )
      : undefined;

  const highestSpendingMonth = data?.highestSpendingMonth ||
    (highestMonthFromTrend
      ? {
          month: highestMonthFromTrend.month,
          amount: highestMonthFromTrend.amount,
        }
      : undefined);

  const highestMonthAmountFromTrend = highestSpendingMonth
    ? trend.find((item) => isSameMonthRef(item.month, highestSpendingMonth.month))
        ?.amount || 0
    : 0;

  const highestMonthAmount = highestSpendingMonth
    ? highestSpendingMonth.amount > 0
      ? highestSpendingMonth.amount
      : highestMonthAmountFromTrend > 0
      ? highestMonthAmountFromTrend
      : totalDebit
    : 0;

  const topCategoryFromApi =
    data?.topCategory && data.topCategory.name
      ? {
          name: String(data.topCategory.name),
          percentage: Number(data.topCategory.percentage || 0),
        }
      : undefined;

  const mostSpendingCategory =
    topCategoryFromApi ||
    (highestCategory && highestCategory.name
      ? {
          name: String(highestCategory.name),
          percentage: Number(highestCategory.percentage || 0),
        }
      : undefined);

  const highlightCards = [
    highestSpendingMonth
      ? {
          title: "Highest Spending Month",
          value: formatMonthLabel(highestSpendingMonth.month),
          sub: `${formatMoney(highestMonthAmount)} spent`,
          borderColor: "#FB923C",
          iconName: "trending-up-outline",
          iconBg: "#FFF7ED",
        }
      : trend.length === 1
      ? {
          title: "Highest Spending Month",
          value: formatMonthLabel(trend[0].month),
          sub: `${formatMoney(trend[0].amount)} spent`,
          borderColor: "#FB923C",
          iconName: "trending-up-outline",
          iconBg: "#FFF7ED",
        }
      : {
          title: "Highest Spending Month",
          value: "No month data",
          sub: "Waiting for monthly analytics",
          borderColor: "#FB923C",
          iconName: "trending-up-outline",
          iconBg: "#FFF7ED",
        },
    mostSpendingCategory
      ? {
          title: "Most Spending Category",
          value: mostSpendingCategory.name,
          sub:
            mostSpendingCategory.percentage > 0
              ? `${mostSpendingCategory.percentage}% of total spend`
              : "Top category by spending",
          borderColor: "#3B82F6",
          iconName: "pie-chart-outline",
          iconBg: "#EFF6FF",
        }
      : {
          title: "Most Spending Category",
          value: "No category data",
          sub: "Waiting for category analytics",
          borderColor: "#3B82F6",
          iconName: "pie-chart-outline",
          iconBg: "#EFF6FF",
        },
  ];

  return (
    <>
      {/* Horizontal insight mini cards */}
      <View style={styles.horizontalScrollContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {highlightCards.map((card) => (
            <View key={card.title} style={styles.insightCard}>
              <InsightMiniCard
                title={card.title}
                value={card.value}
                sub={card.sub}
                borderColor={card.borderColor}
                iconName={card.iconName}
                iconBg={card.iconBg}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Donut chart with colored segments */}
      <Card>
        <Text style={styles.heading}>Spending by Category</Text>
        <Donut categories={normalizedCategories} total={totalDebit} />
        <View style={styles.legend}>
          {normalizedCategories.map((cat, i) => (
            <View key={cat.name} style={styles.legendItem}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] },
                ]}
              />
              <Text style={styles.legendLabel}>{cat.name}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Monthly trend chart */}
      <MonthlyTrend data={data?.monthlyTrend} totalDebit={totalDebit} />
    </>
  );
};

const styles = StyleSheet.create({
  heading: { fontWeight: "600", fontSize: 15, marginBottom: 4 },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    marginRight: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  legendLabel: { color: "#64748B", fontSize: 12 },
  horizontalScrollContainer: {
    height: 130,
    marginTop: 8,
    marginBottom: 8,
  },
  scrollContent: {
    paddingRight: 16,
    alignItems: "center",
  },
  insightCard: {
    marginRight: 12,
  },
});
