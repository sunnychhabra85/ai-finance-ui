import { Ionicons } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../../store/authStore";

export default function TabsLayout() {
    const user = useAuthStore((s) => s.user);

    useEffect(() => {
        if (!user) {
            router.replace("/auth");
        }
    }, [user]);

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#2563EB",
            }}
        >
            <Tabs.Screen
                name="upload"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="cloud-upload-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="overview"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="chat"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="chatbubble-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
