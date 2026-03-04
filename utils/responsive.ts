import { Platform, useWindowDimensions } from 'react-native';

/**
 * Responsive design utilities for cross-platform consistency
 */

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  
  return {
    width,
    height,
    isWeb: Platform.OS === 'web',
    isAndroid: Platform.OS === 'android',
    isIOS: Platform.OS === 'ios',
    isMobile: Platform.OS !== 'web',
    isLargeScreen: width > 768,
    isTablet: width > 600 && width < 900,
    isPhone: width <= 600,
  };
};

/**
 * Adaptive padding based on screen size
 */
export const getAdaptivePadding = (width: number) => {
  if (width > 768) return 32; // Web/Tablet
  if (width > 600) return 24; // Large phone
  return 16; // Small phone
};

/**
 * Adaptive font sizes
 */
export const getAdaptiveFontSize = (baseSize: number, width: number) => {
  if (width > 768) return baseSize * 1.1;
  if (width > 600) return baseSize * 1.05;
  return baseSize;
};

/**
 * Adaptive border radius
 */
export const getAdaptiveBorderRadius = (baseRadius: number, width: number) => {
  if (width > 768) return baseRadius + 4;
  return baseRadius;
};

/**
 * Get safe margins for web to prevent full-width stretching
 */
export const getWebMaxWidth = () => {
  return { maxWidth: 1200, marginHorizontal: 'auto' as any };
};

/**
 * Get container styles that adapt to platform
 */
export const getContainerStyles = (width: number, isWeb: boolean) => {
  const baseStyles: any = {
    flex: 1,
    paddingHorizontal: getAdaptivePadding(width),
  };

  if (isWeb) {
    return {
      ...baseStyles,
      maxWidth: 1200,
      marginHorizontal: 'auto',
      alignSelf: 'center',
    };
  }

  return baseStyles;
};
