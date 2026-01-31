import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../theme/colors";

export const AppInput = ({
  label,
  icon,
  error,
  ...props
}: any) => {
  return (
    <View style={{ marginTop: 16 }}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.container, error && styles.errorBorder]}>
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color="#94A3B8"
            style={{ marginRight: 10 }}
          />
        )}
        <TextInput
          placeholderTextColor={colors.textLight}
          style={styles.input}
          {...props}
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 6,
    fontWeight: "600",
    color: "#0F172A",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    backgroundColor: "#F8FAFC",
  },
  input: { flex: 1, color: colors.textDark },
  errorBorder: { borderColor: "#EF4444" },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
  },
});
