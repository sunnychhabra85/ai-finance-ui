import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    View
} from "react-native";

import { Chips } from "../../components/Chips";
import { InsightsBlock } from "../../components/InsightsBlock";
import { ScreenHeader } from "../../components/ScreenHeader";
import { SearchBar } from "../../components/SearchBar";
import { Segment } from "../../components/Segment";
import { SummaryCards } from "../../components/SummaryCards";
import { TransactionItem } from "../../components/TransactionItem";
import type { Category } from "../../data/transactions";
import { useTransactions } from "../../hooks/useTransactions";
import { useAuthStore } from "../../store/authStore";
import { colors } from "../../theme/colors";

export default function Overview() {
    const [tab, setTab] = useState("Transactions");
    const logout = useAuthStore((s) => s.logout);
    const [search, setSearch] = useState("");
    // Import Category type if not already imported
    // import type { Category } from "../../types/Category";
    const [category, setCategory] = useState<Category | "All">("All");

    const filtered = useTransactions(search, category);

    const DATA = [
        { id: "1", title: "Spotify Premium", date: "2024-05-24", amount: "-$14.99" },
        { id: "2", title: "Uber Ride", date: "2024-05-23", amount: "-$24.50" },
        { id: "3", title: "Whole Foods Market", date: "2024-05-23", amount: "-$142.30" },
        { id: "4", title: "Salary Deposit", date: "2024-05-22", amount: "+$4500.00" },
        { id: "5", title: "Starbucks Coffee", date: "2024-05-21", amount: "-$6.75" },
    ];

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 140 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Header with logout */}
            <View style={styles.headerRow}>
                <View>
                    {/* <Text style={styles.title}>Financial Overview</Text>
          <Text style={styles.subtitle}>Your transactions & insights</Text> */}
                    <ScreenHeader
                        title="Financial Overview"
                        subtitle="Your transactions & insights"
                    />

                </View>

                {/* <TouchableOpacity
          onPress={() => {
            logout();
            router.replace("/");
          }}
        >
          <Ionicons name="log-out-outline" size={24} color="#64748B" />
        </TouchableOpacity> */}
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
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 24,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: { fontSize: 26, fontWeight: "700" },
    subtitle: { color: "#64748B", marginTop: 4 },
});
