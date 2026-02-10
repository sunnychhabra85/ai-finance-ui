import { Stack } from "expo-router";
import { ActivityIndicator, Platform, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// If useAuthStore is the default export:
import { useAuthStore } from "../store/authStore";

// Or, if useAuthStore is not exported at all, export it from '../store/authStore':
// export const useAuthStore = ... (in ../store/authStore)

export default function Layout() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);

  const safeAreaEdges: readonly ("top" | "left" | "right" | "bottom")[] = Platform.OS === "web" ? [] : ["top", "left", "right"];

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} edges={safeAreaEdges}>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}