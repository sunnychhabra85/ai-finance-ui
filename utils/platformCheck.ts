import { Platform } from "react-native";

export const isNative = Platform.OS === "ios" || Platform.OS === "android";
export const isWeb = Platform.OS === "web";

/**
 * Wrapper for native-only functions
 * Returns a no-op function on web
 */
export const nativeOnly = (fn: (...args: any[]) => void) => {
  return isWeb ? () => {} : fn;
};