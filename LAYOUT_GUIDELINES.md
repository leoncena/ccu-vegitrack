# Layout & Spacing Guidelines

This document outlines the design system and spacing conventions for the VegiTrack project. **Always use relative spacing based on design tokens** rather than hardcoded pixel values.

## Design Tokens

Design tokens are defined in `vegitrack/src/index.css` under the `@theme` block. Always reference these tokens when adding spacing or styling.

### Spacing Tokens

```css
--spacing-page: 24px      /* Large page-level spacing */
--spacing-section: 16px   /* Medium section spacing */
--spacing-card: 12px      /* Small card/component spacing */
```

## Core Principles

### ✅ DO: Use Relative Spacing with Multipliers

Always use `calc()` with spacing tokens multiplied by a factor:

```tsx
// ✅ GOOD: Relative spacing
style={{
  marginTop: 'calc(var(--spacing-card) * 0.5)',  // 6px
  paddingLeft: 'var(--spacing-card)',             // 12px
  gap: 'calc(var(--spacing-section) * 2.375)',    // 38px
}}
```

### ❌ DON'T: Use Hardcoded Pixel Values

```tsx
// ❌ BAD: Hardcoded values
style={{
  marginTop: '6px',
  paddingLeft: '12px',
  gap: '38px',
}}
```

### ❌ DON'T: Use Hardcoded Rem Values

```tsx
// ❌ BAD: Hardcoded rem (still not relative to design system)
style={{
  marginTop: '0.375rem',
  paddingLeft: '0.75rem',
}}
```

## Spacing Multiplier Guide

Use these common multipliers for consistent spacing:

| Multiplier | Result (with --spacing-card) | Result (with --spacing-section) | Use Case |
|------------|------------------------------|----------------------------------|----------|
| `* 0.5`    | 6px                         | 8px                             | Very tight spacing (label to input) |
| `* 1.0`    | 12px                        | 16px                            | Standard small spacing (card padding) |
| `* 1.5`    | 18px                        | 24px                            | Medium spacing |
| `* 2.0`    | 24px                        | 32px                            | Large spacing |
| `* 2.375`  | 28.5px                      | 38px                            | Custom spacing (e.g., button to divider) |
| `* 2.6875` | 32.25px                     | 43px                            | Custom spacing (e.g., divider to icons) |

## Common Spacing Patterns

### Input Fields

```tsx
// Label to input field
style={{
  marginTop: 'calc(var(--spacing-card) * 0.5)',  // 6px
}}

// Input field padding
style={{
  paddingLeft: 'var(--spacing-card)',   // 12px
  paddingRight: 'var(--spacing-card)',  // 12px
}}
```

### Vertical Spacing Between Sections

```tsx
// Between major sections (e.g., button to divider)
style={{
  marginTop: 'calc(var(--spacing-section) * 2.375)',  // 38px
}}

// Between smaller elements (e.g., divider to icons)
style={{
  marginTop: 'calc(var(--spacing-section) * 2.6875)',  // 43px
}}
```

### Component Wrappers

```tsx
// Container with consistent spacing
<div
  className="flex flex-col"
  style={{
    marginTop: 'calc(var(--spacing-section) * 2.375)',
  }}
>
  {/* content */}
</div>
```

## Color Tokens

Always use color tokens from the design system:

```tsx
// ✅ GOOD
style={{
  color: 'var(--color-primary)',
  backgroundColor: 'var(--color-background)',
  borderColor: 'rgba(23, 78, 5, 0.7)',  // Custom opacity when needed
}}

// ❌ BAD
style={{
  color: '#1d5d0a',
  backgroundColor: '#fffcf6',
}}
```

## Typography Tokens

```tsx
// ✅ GOOD
style={{
  fontFamily: 'var(--font-body)',      // Poppins
  fontFamily: 'var(--font-brand)',     // Averia Serif Libre
}}
```

## Border Radius Tokens

```css
--radius-card: 20px;
--radius-button: 30px;
--radius-sm: 5px;
--radius-md: 10px;
```

Use these for consistent rounded corners:

```tsx
style={{
  borderRadius: 'var(--radius-button)',  // 30px for buttons
  borderRadius: 'var(--radius-card)',    // 20px for cards
}}
```

## Benefits of This Approach

1. **Consistency**: All spacing is derived from a single source of truth
2. **Maintainability**: Change spacing tokens once, updates everywhere
3. **Scalability**: Easy to adjust the entire design system proportionally
4. **Accessibility**: Ensures consistent spacing ratios across the app
5. **Design System Compliance**: Aligns with Figma design specifications

## For AI Tools (Cursor, GitHub Copilot, etc.)

When working on layout and spacing:

1. **Always check** `vegitrack/src/index.css` for available design tokens
2. **Never hardcode** pixel values or fixed rem/em values
3. **Use multipliers** of spacing tokens with `calc()` for custom values
4. **Reference this file** when adding new spacing or padding
5. **Maintain consistency** by reusing existing spacing patterns

## Example: Complete Input Group

```tsx
<div>
  <Label
    htmlFor="email"
    className="text-sm"
    style={{
      fontFamily: 'var(--font-body)',
      color: 'var(--color-primary)',
      letterSpacing: '-0.2px',
    }}
  >
    Email
  </Label>
  <Input
    id="email"
    type="email"
    className="h-[42px] rounded-[8px]"
    style={{
      fontFamily: 'var(--font-body)',
      backgroundColor: 'transparent',
      marginTop: 'calc(var(--spacing-card) * 0.5)',  // 6px - label to input
      paddingLeft: 'var(--spacing-card)',             // 12px - left padding
      paddingRight: 'var(--spacing-card)',            // 12px - right padding
    }}
  />
</div>
```

## Questions?

- Check existing components for spacing patterns
- Reference `vegitrack/src/index.css` for all available tokens
- Follow the multiplier guide above for common spacing needs

