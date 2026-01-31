import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "../store/authStore";

export const ScreenHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  const logout = useAuthStore((s) => s.logout);

  return (
    <View style={styles.wrapper}>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <TouchableOpacity
        onPress={() => {
          logout();
          router.replace("/auth");
        }}
        style={styles.logout}
      >
        <Ionicons name="log-out-outline" size={22} color="#64748B" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",                 // ⭐ important
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  textBlock: {
    flex: 1,                      // takes remaining space
    paddingRight: 12,
  },
  logout: {
    paddingTop: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0F172A",
  },
  subtitle: {
    color: "#64748B",
    marginTop: 4,
  },
});
