import React, { useState } from "react";
import {
    StyleSheet,
    View,
    useWindowDimensions
} from "react-native";

import { Chips } from "../../components/Chips";
import { InsightsBlock } from "../../components/InsightsBlock";
import { ResponsiveContainer } from "../../components/ResponsiveContainer";
import { ScreenHeader } from "../../components/ScreenHeader";
import { SearchBar } from "../../components/SearchBar";
import { Segment } from "../../components/Segment";
import { SummaryCards } from "../../components/SummaryCards";
import { TransactionItem } from "../../components/TransactionItem";
import type { Category } from "../../data/transactions";
import { useTransactions } from "../../hooks/useTransactions";
import { useAuthStore } from "../../store/authStore";
import { colors } from "../../theme/colors";
import { getAdaptivePadding } from "../../utils/responsive";

export default function Overview() {
    const [tab, setTab] = useState("Transactions");
    const logout = useAuthStore((s) => s.logout);
    const [search, setSearch] = useState("");
    const { width } = useWindowDimensions();
    const [category, setCategory] = useState<Category | "All">("All");
    const padding = getAdaptivePadding(width);

    const filtered = useTransactions(search, category);

    const DATA = [
        { id: "1", title: "Spotify Premium", date: "2024-05-24", amount: "-$14.99" },
        { id: "2", title: "Uber Ride", date: "2024-05-23", amount: "-$24.50" },
        { id: "3", title: "Whole Foods Market", date: "2024-05-23", amount: "-$142.30" },
        { id: "4", title: "Salary Deposit", date: "2024-05-22", amount: "+$4500.00" },
        { id: "5", title: "Starbucks Coffee", date: "2024-05-21", amount: "-$6.75" },
    ];

    return (
        <ResponsiveContainer style={{ backgroundColor: colors.background, paddingHorizontal: padding }}>
            {/* Header with logout */}
            <View style={styles.headerRow}>
                <View>
                    <ScreenHeader
                        title="Financial Overview"
                        subtitle="Your transactions & insights"
                    />
                </View>
            </View>

            <SummaryCards />
            <Segment tab={tab} setTab={setTab} />

            {tab === "Transactions" ? (
                <>
                    <SearchBar value={search} onChange={setSearch} />
                    <Chips selected={category} onSelect={setCategory} />
                    {filtered.map((item) => (
                        <TransactionItem
                            key={item.id}
                            title={item.title}
                            date={item.date}
                            amount={
                                item.amount > 0
                                    ? `+$${item.amount.toFixed(2)}`
                                    : `-$${Math.abs(item.amount).toFixed(2)}`
                            }
                        />
                    ))}
                </>
            ) : (
                <InsightsBlock />
            )}
        </ResponsiveContainer>
    );
}

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
});
