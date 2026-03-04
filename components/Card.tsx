import React from "react";
import { Platform, StyleSheet, View, useWindowDimensions } from "react-native";
import { colors } from "../theme/colors";
import { getAdaptiveBorderRadius } from "../utils/responsive";

export const Card: React.FC<{ children: React.ReactNode; style?: any }> = ({
  children,
  style,
}) => {
  const { width } = useWindowDimensions();
  const isWeb = width > 768;

  return (
    <View
      style={[
        styles.card,
        {
          borderRadius: getAdaptiveBorderRadius(18, width),
          marginVertical: isWeb ? 12 : 8,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    padding: 16,
    ...(Platform.OS === 'web'
      ? {
          boxShadow: '0 10px 20px 0 rgba(0, 0, 0, 0.08)',
        }
      : {
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 10 },
          elevation: 8,
        }),
  },
});
