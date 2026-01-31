import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../theme/colors";

export const AppButton = ({ title, onPress, disabled }: any) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && { opacity: 0.5 }]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{title} →</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  text: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
