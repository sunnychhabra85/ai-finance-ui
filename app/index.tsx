import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuthStore } from "../store/authStore";

export default function Index() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading); // Add this to your store if not present

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If user is authenticated, go to tabs
  if (user) {
    return <Redirect href="/(tabs)/upload" />;
  }

  // If not authenticated, go to auth
  return <Redirect href="/(auth)/auth" />;
}