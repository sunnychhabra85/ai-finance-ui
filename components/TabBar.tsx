import { StyleSheet, View } from "react-native";

export default function TabBar({ children }: any) {
  return <View style={styles.bar}>{children}</View>;
}

const styles = StyleSheet.create({
  bar: {
    height: 64,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
