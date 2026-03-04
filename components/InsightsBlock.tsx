import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useDashboard } from "../hooks/useDashboard";
import { Card } from "./Card";
import { Donut } from "./Donut";
import { InsightMiniCard } from "./InsightMiniCard";
import { MonthlyTrend } from "./MonthlyTrend";

export const InsightsBlock = () => {
    const { data, loading } = useDashboard();

    if (loading) {
        return <ActivityIndicator size="large" color="#2563EB" />;
    }

    return (
        <>
            {/* Horizontal insight cards - Real Data from API */}
            <View style={styles.horizontalScrollContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {data?.highestSpendingMonth && (
                        <View style={styles.insightCard}>
                            <InsightMiniCard
                                title="Highest Spending Month"
                                value={data.highestSpendingMonth.month}
                                sub={`$${data.highestSpendingMonth.amount.toLocaleString()} spent`}
                                borderColor="#FB923C"
                            />
                        </View>
                    )}
                    {data?.topCategory && (
                        <View style={styles.insightCard}>
                            <InsightMiniCard
                                title="Top Category"
                                value={data.topCategory.name}
                                sub={`${data.topCategory.percentage}% of total spend`}
                                borderColor="#3B82F6"
                            />
                        </View>
                    )}
                </ScrollView>
            </View>

            {/* STATIC DATA WAS HERE - Now using API data from useDashboard() */}

            {/* Donut block - Real Data from API */}
            <Card>
                <Text style={styles.heading}>Spending by Category</Text>
                <Donut />
                <View style={styles.labels}>
                    {data?.categories && data.categories.length > 0 ? (
                        data.categories.map((cat) => (
                            <Text key={cat.name} style={styles.label}>
                                {cat.name}
                            </Text>
                        ))
                    ) : (
                        ["Food", "Travel", "Shopping", "Bills", "Entertainment"].map(
                            (l) => (
                                <Text key={l} style={styles.label}>
                                    {l}
                                </Text>
                            )
                        )
                    )}
                </View>
            </Card>

            {/* Monthly trend chart */}
            <MonthlyTrend />
        </>
    );
};

const styles = StyleSheet.create({
    heading: { fontWeight: "600", marginBottom: 12 },
    labels: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
    },
    label: { color: "#64748B", fontSize: 12 },
    horizontalScrollContainer: {
        height: 120,
        marginTop: 8,
        marginBottom: 16,
    },
    scrollContent: {
        paddingLeft: 16,
        paddingRight: 24,
        alignItems: 'center',
    },
    insightCard: {
        marginRight: 12,
    },

});
