import React, { useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
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
import { useApiTransactions } from "../../hooks/useApiTransactions";
import { useAuthStore } from "../../store/authStore";
import { colors } from "../../theme/colors";
import { getAdaptivePadding } from "../../utils/responsive";

export default function Overview() {
    const [tab, setTab] = useState("Transactions");
    const logout = useAuthStore((s) => s.logout);
    const [search, setSearch] = useState("");
    const { width } = useWindowDimensions();
    const [category, setCategory] = useState<string>("All");
    const padding = getAdaptivePadding(width);

    // Use real API transactions instead of static data
    // Always fetch ALL transactions to get all categories for chips
    const { transactions, categories, loading, error } = useApiTransactions();
    
    
    // Filter by category and search term on the client side
    const filtered = transactions
        .filter((t) => category === 'All' || t.category === category)
        .filter((t) => t.description?.toLowerCase().includes(search.toLowerCase()));
    /* STATIC DATA - COMMENTED OUT - Using API instead
    const filtered = useTransactions(search, category);

    const DATA = [
        { id: "1", title: "Spotify Premium", date: "2024-05-24", amount: "-$14.99" },
        { id: "2", title: "Uber Ride", date: "2024-05-23", amount: "-$24.50" },
        { id: "3", title: "Whole Foods Market", date: "2024-05-23", amount: "-$142.30" },
        { id: "4", title: "Salary Deposit", date: "2024-05-22", amount: "+$4500.00" },
        { id: "5", title: "Starbucks Coffee", date: "2024-05-21", amount: "-$6.75" },
    ];
    */

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
                    <Chips selected={category} onSelect={setCategory} categories={categories} />
                    
                    {loading && <ActivityIndicator size="large" color="#2563EB" />}
                    
                    {error && <Text style={{ color: 'red', padding: 10 }}>Error: {error}</Text>}
                    
                    {!loading && !error && filtered.map((item) => {
                        const amount = Number(item.amount);
                        return (
                            <TransactionItem
                                key={item.id}
                                title={item.description?.slice(0, 20) + "..." || "No description"}
                                date={item.date.split("T")[0]} // Show only date part
                                amount={
                                    amount > 0
                                        ? `${amount.toFixed(2)}`
                                        : `-${Math.abs(amount).toFixed(2)}`
                                }
                            />
                        );
                    })}
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
