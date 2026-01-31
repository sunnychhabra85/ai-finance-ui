import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from "./Card";
import { Donut } from "./Donut";
import { InsightMiniCard } from "./InsightMiniCard";
import { MonthlyTrend } from "./MonthlyTrend";

export const InsightsBlock = () => {
    return (
        <>
            {/* Horizontal insight cards */}
            <View style={styles.horizontalScrollContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.insightCard}>
                        <InsightMiniCard
                            title="Highest Spending Month"
                            value="June"
                            sub="$3,500 spent"
                            borderColor="#FB923C"
                        />
                    </View>
                    <View style={styles.insightCard}>
                        <InsightMiniCard
                            title="Top Category"
                            value="Food"
                            sub="25% of total spend"
                            borderColor="#3B82F6"
                        />
                    </View>
                    <View style={styles.insightCard}>
                        <InsightMiniCard
                            title="Top Category"
                            value="Food"
                            sub="25% of total spend"
                            borderColor="#3B82F6"
                        />
                    </View>
                </ScrollView>
            </View>


            {/* Donut block */}
            <Card>
                <Text style={styles.heading}>Spending by Category</Text>
                <Donut />
                <View style={styles.labels}>
                    {["Food", "Travel", "Shopping", "Bills", "Entertainment"].map(
                        (l) => (
                            <Text key={l} style={styles.label}>
                                {l}
                            </Text>
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
