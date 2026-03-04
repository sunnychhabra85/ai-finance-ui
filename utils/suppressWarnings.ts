/**
 * Suppress known deprecation warnings from third-party libraries
 * 
 * IMPORTANT: These warnings come from React Native Web and Expo libraries that haven't updated yet.
 * The warnings are NOT from your application code. They will be resolved when the libraries update.
 * 
 * Issue: React Native Web 0.19+ changed `pointerEvents` from a prop to a style property.
 * Libraries like Expo Router, React Navigation, etc. still use the old API.
 * 
 * You can safely suppress these warnings until the ecosystem catches up.
 * To see all warnings again, comment out the suppressWarnings() call in app/_layout.tsx
 */

const SUPPRESSED_WARNINGS = [
  'props.pointerEvents is deprecated',
];

export const suppressWarnings = () => {
  const originalWarn = console.warn;
  
  console.warn = (...args: any[]) => {
    const warning = args[0];
    
    if (typeof warning === 'string') {
      // Check if this warning should be suppressed
      const shouldSuppress = SUPPRESSED_WARNINGS.some(suppressedWarning =>
        warning.includes(suppressedWarning)
      );
      
      if (shouldSuppress) {
        return; // Don't log this warning
      }
    }
    
    // Log all other warnings normally
    originalWarn(...args);
  };
};
