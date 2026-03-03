import React from "react";
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { colors } from "../theme/colors";
import { getAdaptiveFontSize } from "../utils/responsive";

export const AppButton = ({ title, onPress, disabled }: any) => {
  const { width } = useWindowDimensions();
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && { opacity: 0.5 },
        { paddingVertical: width > 768 ? 18 : 16 },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, { fontSize: getAdaptiveFontSize(16, width) }]}>
        {title} →
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  text: {
    color: "#fff",
    fontWeight: "600",
  },
});
