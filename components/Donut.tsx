import { StyleSheet, Text, View } from "react-native";

export const Donut = () => (
  <View style={styles.wrapper}>
    <View style={styles.circle}>
      <Text style={styles.total}>$1,550</Text>
      <Text>Total</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", marginVertical: 20 },
  circle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 20,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  total: { fontWeight: "700", fontSize: 22 },
});
