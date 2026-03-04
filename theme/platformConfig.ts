/**
 * Platform-specific styling configuration
 * Use this to maintain UI consistency across web and mobile
 */

import { Platform } from 'react-native';

export const platformConfig = {
  // Typography
  typography: {
    headingWeb: { fontSize: 32, fontWeight: '700' },
    headingMobile: { fontSize: 28, fontWeight: '700' },
    subheadingWeb: { fontSize: 20, fontWeight: '600' },
    subheadingMobile: { fontSize: 18, fontWeight: '600' },
    bodyWeb: { fontSize: 16, fontWeight: '400' },
    bodyMobile: { fontSize: 14, fontWeight: '400' },
  },

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Container dimensions
  container: {
    maxWidth: 1200,
    minWidth: Platform.OS === 'web' ? 320 : 0,
  },

  // Border radius
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xlarge: 24,
  },

  // Shadows - web and mobile compatible
  shadows: {
    light: Platform.OS === 'web'
      ? {
          boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        }
      : {
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
        },
    medium: Platform.OS === 'web'
      ? {
          boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.08)',
        }
      : {
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4,
        },
    heavy: Platform.OS === 'web'
      ? {
          boxShadow: '0 8px 20px 0 rgba(0, 0, 0, 0.12)',
        }
      : {
          shadowColor: '#000',
          shadowOpacity: 0.12,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 8 },
          elevation: 8,
        },
  },
};

export const webStyles = Platform.OS === 'web'
  ? {
      cursor: 'pointer' as any,
      userSelect: 'none' as any,
      WebkitUserSelect: 'none' as any,
    }
  : {};
