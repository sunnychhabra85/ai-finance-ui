import { Stack, router } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../../store/authStore";

export default function AuthLayout() {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user) {
      router.replace("/(tabs)/upload");
    }
  }, [user]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
