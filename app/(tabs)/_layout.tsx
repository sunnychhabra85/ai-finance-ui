import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { useEffect } from "react";
import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";
import { useAuthStore } from "../../store/authStore";

export default function TabsLayout() {
    const user = useAuthStore((s) => s.user);
    const { width } = useWindowDimensions();
    const isWeb = Platform.OS === 'web';

    useEffect(() => {
        if (!user) {
            router.replace("/auth");
        }
    }, [user]);

    return (
        <View style={styles.container}>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: "#2563EB",
                    tabBarStyle: isWeb ? {
                        position: 'relative',
                        backgroundColor: '#ffffff',
                        borderTopWidth: 1,
                        borderTopColor: '#E2E8F0',
                        height: 60,
                        width: 414, // Match mobile width
                        alignSelf: 'center',
                    } : {
                        borderTopWidth: 1,
                        borderTopColor: '#E2E8F0',
                        height: 60,
                    },
                }}
            >
                <Tabs.Screen
                    name="upload"
                    options={{
                        title: "Upload",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="cloud-upload-outline" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="overview"
                    options={{
                        title: "Overview",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="home-outline" size={size} color={color} />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="chat"
                    options={{
                        title: "Chat",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="chatbubble-outline" size={size} color={color} />
                        ),
                    }}
                />
            </Tabs>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
});

