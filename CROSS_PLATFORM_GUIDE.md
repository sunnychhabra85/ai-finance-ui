# Cross-Platform UI Guide

This document outlines best practices for maintaining consistent UI across web and mobile platforms in your Expo app.

## Overview

Your app now includes responsive design utilities and components that automatically adapt to different screen sizes and platforms.

## Files Added/Modified

### New Files:
1. **`utils/responsive.ts`** - Responsive design utilities
2. **`theme/platformConfig.ts`** - Platform-specific configuration
3. **`components/ResponsiveContainer.tsx`** - Responsive container component

### Modified Files:
1. **`components/Card.tsx`** - Added responsive border radius and spacing
2. **`components/AppButton.tsx`** - Added responsive font sizes and padding
3. **`components/AppInput.tsx`** - Added responsive typography and padding
4. **`app/(tabs)/_layout.tsx`** - Added web-specific tab bar styling
5. **`app/(tabs)/overview.tsx`** - Implemented ResponsiveContainer

## How to Use Responsive Utilities

### 1. useResponsive Hook
```typescript
import { useResponsive } from '../utils/responsive';

const MyComponent = () => {
  const { width, isWeb, isLargeScreen, isMobile } = useResponsive();
  
  return (
    <View>
      {isWeb && <Text>Web version</Text>}
      {isMobile && <Text>Mobile version</Text>}
    </View>
  );
};
```

### 2. Adaptive Sizing Functions
```typescript
import { getAdaptivePadding, getAdaptiveFontSize, getAdaptiveBorderRadius } from '../utils/responsive';

const padding = getAdaptivePadding(width); // Returns 32 for web, 24 for tablet, 16 for phone
const fontSize = getAdaptiveFontSize(16, width); // Scales font size based on screen width
const radius = getAdaptiveBorderRadius(12, width); // Scales border radius for web
```

### 3. ResponsiveContainer Component
Use this for all page-level ScrollView containers:

```typescript
import { ResponsiveContainer } from '../components/ResponsiveContainer';

export default function MyPage() {
  return (
    <ResponsiveContainer maxWidth={1200}>
      {/* Your content */}
    </ResponsiveContainer>
  );
}
```

## Responsive Breakpoints

- **Phone**: width ≤ 600px
- **Tablet**: width > 600px and width < 900px
- **Desktop/Web**: width > 768px

## Key Principles

### 1. Use Adaptive Padding
```typescript
const padding = getAdaptivePadding(width);
// Web (width > 768): 32px
// Tablet (600-768): 24px
// Phone (≤600): 16px
```

### 2. Scale Typography
```typescript
const fontSize = getAdaptiveFontSize(baseSize, width);
// Increases on larger screens, maintains baseline on mobile
```

### 3. Consistent Colors
Use the centralized color theme from `theme/colors.ts`:
```typescript
import { colors } from '../theme/colors';
<View style={{ backgroundColor: colors.primary }} />
```

### 4. Shadow Effects
Use predefined shadows from `theme/platformConfig.ts`:
```typescript
import { platformConfig } from '../theme/platformConfig';

const styles = StyleSheet.create({
  card: {
    ...platformConfig.shadows.medium,
  }
});
```

## Platform-Specific Styling

### For Web-Only Features
```typescript
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

<View style={isWeb && { cursor: 'pointer' }} />
```

### For Mobile-Only Features
```typescript
const { isMobile } = useResponsive();

{isMobile && <Ionicons name="arrow-back" />}
```

## Layout Patterns

### Responsive Row Layout
```typescript
<View style={{ 
  flexDirection: 'row',
  flexWrap: isLargeScreen ? 'nowrap' : 'wrap',
  gap: padding,
}}>
  {/* Items that adapt to screen size */}
</View>
```

### Responsive Grid
```typescript
const cols = isLargeScreen ? 3 : (isTablet ? 2 : 1);

<View style={{ 
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: padding,
}}>
  {items.map((item, idx) => (
    <View key={idx} style={{ width: `${100 / cols}%` }}>
      {/* Item content */}
    </View>
  ))}
</View>
```

## Best Practices

1. **Always use ResponsiveContainer for pages**
   - Automatically handles max-width on web
   - Proper padding on all devices

2. **Use adaptive functions instead of hardcoded values**
   - Never use `padding: 16` directly
   - Use `getAdaptivePadding(width)` instead

3. **Test on multiple devices**
   - Test on web: `npm run web`
   - Test on Android: `npm run android`
   - Test on iOS: `npm run ios`

4. **Use consistent color tokens**
   - Always import from `theme/colors.ts`
   - No hardcoded color values

5. **Leverage useWindowDimensions**
   - Hook into screen changes automatically
   - Updates when device rotates

## Testing Your Changes

### Web
```bash
npm run web
# Opens on http://localhost:8081
# Test at different viewport sizes (F12 DevTools)
```

### Mobile
```bash
npm run android
# Test on Android emulator
```

### Responsive Testing Checklist
- [ ] Looks good on phone (375px)
- [ ] Looks good on tablet (768px)
- [ ] Looks good on desktop (1200px+)
- [ ] Text is readable at all sizes
- [ ] Touch targets are at least 44px on mobile
- [ ] No horizontal scrolling on any device
- [ ] Images scale proportionally
- [ ] Components don't overlap

## Common Issues & Solutions

### Issue: Content too wide on web
**Solution**: Use ResponsiveContainer with maxWidth
```typescript
<ResponsiveContainer maxWidth={1000}>
  {/* Content automatically centers and constrains width */}
</ResponsiveContainer>
```

### Issue: Font too small on web
**Solution**: Use getAdaptiveFontSize
```typescript
<Text style={{ fontSize: getAdaptiveFontSize(14, width) }} />
```

### Issue: Touch targets too small on mobile
**Solution**: Ensure minimum 44px touch target
```typescript
<TouchableOpacity style={{ height: 44, minWidth: 44 }} />
```

### Issue: Different layout on web vs mobile
**Solution**: Use useResponsive to conditionally render
```typescript
const { isWeb } = useResponsive();
{isWeb ? <WebLayout /> : <MobileLayout />}
```

## Next Steps

Apply these responsive patterns to all remaining components:
- [ ] LoginForm.tsx
- [ ] RegisterForm.tsx
- [ ] SearchBar.tsx
- [ ] TransactionItem.tsx
- [ ] SummaryCards.tsx
- [ ] All chart components

Run `npm run web` and `npm run android` to verify changes!
