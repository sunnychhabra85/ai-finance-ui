import React from "react";
import { Platform, ScrollView, ScrollViewProps, StyleSheet, useWindowDimensions, View } from "react-native";
import { getAdaptivePadding } from "../utils/responsive";

interface ResponsiveContainerProps extends ScrollViewProps {
  children: React.ReactNode;
  maxWidth?: number;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth = 414, // Mobile width (iPhone 12/13)
  contentContainerStyle,
  ...props
}) => {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const padding = getAdaptivePadding(width);

  // On web, always use mobile width and center it
  const containerWidth = isWeb ? maxWidth : "100%";
  const alignSelf = isWeb ? ("center" as any) : undefined;

  return (
    <View style={[
      styles.wrapper,
      isWeb && styles.webWrapper
    ]}>
      <ScrollView
        style={[
          styles.container,
          isWeb && { 
            width: containerWidth,
            alignSelf: alignSelf,
          },
        ]}
        contentContainerStyle={[
          {
            paddingHorizontal: isWeb ? 0 : padding,
            paddingBottom: 140,
          },
          isWeb && {
            width: "100%",
          },
          contentContainerStyle,
        ]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!isWeb} // Disable scroll indicator on web for cleaner look
        {...props}
      >
        {children}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  webWrapper: {
    backgroundColor: '#f5f5f5', // Gray background for web
    justifyContent: 'center' as any,
    alignItems: 'center' as any,
  },
  container: {
    flex: 1,
  },
});
