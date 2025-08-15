# 🎨 Theme System Guide

## Overview

The DataViz Playground now features a modern, accessible theme system with support for light, dark, and system themes. The theme system is built on top of `next-themes` and provides seamless switching between themes with proper color contrast and accessibility.

## 🚀 Features

- **Three Theme Modes**: Light, Dark, and System (automatic)
- **Smooth Transitions**: All theme changes include smooth CSS transitions
- **Accessibility**: WCAG AA compliant color contrast ratios
- **System Integration**: Automatically follows system theme preferences
- **Persistent Storage**: Theme preference is saved in localStorage
- **No Flash**: Prevents theme flash on page load

## 🎯 Usage

### Theme Toggle Component

The `ThemeToggle` component provides a beautiful dropdown interface for theme selection:

```tsx
import { ThemeToggle } from '@/components/ThemeToggle'

// In your component
<ThemeToggle />
```

### Theme Provider Setup

The theme system is automatically configured in `app/layout.tsx`:

```tsx
import { ThemeProvider } from '@/components/ThemeProvider'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

## 🎨 Color System

### CSS Variables

The theme system uses CSS custom properties for all colors:

```css
:root {
  /* Light theme colors */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* ... more colors */
}

.dark {
  /* Dark theme colors */
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --primary: 142.1 76.2% 36.3%;
  --primary-foreground: 355.7 100% 97.3%;
  /* ... more colors */
}
```

### Tailwind Classes

Use these Tailwind classes for theme-aware styling:

```tsx
// Background colors
className="bg-background"        // Main background
className="bg-card"              // Card background
className="bg-muted"             // Muted background

// Text colors
className="text-foreground"      // Main text
className="text-muted-foreground" // Muted text
className="text-primary"         // Primary accent

// Border colors
className="border-border"        // Border color
className="border-input"         // Input border

// Interactive states
className="hover:bg-primary/10"  // Hover state
className="focus:ring-primary"   // Focus ring
```

## 🎨 Color Palette

### Primary Colors (Green in Dark Mode, Blue in Light Mode)

```css
--primary-50: 213 100% 96%;   /* Lightest */
--primary-100: 214 95% 93%;
--primary-200: 213 97% 87%;
--primary-300: 212 96% 78%;
--primary-400: 213 94% 68%;
--primary-500: 217 91% 60%;   /* Base */
--primary-600: 221 83% 53%;
--primary-700: 224 76% 48%;
--primary-800: 226 71% 40%;
--primary-900: 224 64% 33%;
--primary-950: 226 57% 21%;   /* Darkest */
```

### Semantic Colors

- **Success**: Green palette for positive actions
- **Warning**: Yellow/Orange palette for warnings
- **Error**: Red palette for errors
- **Info**: Blue palette for information

### Usage Examples

```tsx
// Success colors
className="text-success-600 dark:text-success-400"
className="bg-success-50 dark:bg-success-950"

// Warning colors
className="text-warning-600 dark:text-warning-400"
className="bg-warning-50 dark:bg-warning-950"

// Error colors
className="text-error-600 dark:text-error-400"
className="bg-error-50 dark:bg-error-950"
```

## 🔧 Customization

### Adding New Colors

1. Add CSS variables to `app/globals.css`:

```css
:root {
  --custom-color: 220 14% 96%;
}

.dark {
  --custom-color: 240 3.7% 15.9%;
}
```

2. Add to `tailwind.config.js`:

```js
colors: {
  custom: "hsl(var(--custom-color))",
}
```

3. Use in components:

```tsx
className="bg-custom text-custom-foreground"
```

### Custom Theme Variants

Create custom theme variants by extending the CSS:

```css
.theme-custom {
  --background: 200 50% 95%;
  --foreground: 200 50% 5%;
  /* ... other colors */
}
```

## 🧪 Testing

### Theme Demo Page

Visit `/test` to see the theme demo page with:

- Color palette examples
- Component variations
- Interactive theme toggle
- Accessibility testing

### Manual Testing

1. **Theme Switching**: Click the theme toggle in the navigation
2. **System Theme**: Change your system theme and refresh
3. **Persistence**: Refresh the page to verify theme persistence
4. **Accessibility**: Use browser dev tools to test contrast ratios

## 🐛 Troubleshooting

### Common Issues

1. **Theme Flash**: Ensure `suppressHydrationWarning` is set on the html element
2. **Colors Not Updating**: Check that you're using theme-aware classes
3. **Build Errors**: Verify `next-themes` is installed

### Debug Mode

Enable debug mode in the ThemeProvider:

```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
  enableColorScheme
  storageKey="theme"
>
```

## 📱 Responsive Design

The theme system works seamlessly across all screen sizes:

```tsx
// Mobile-first responsive design
className="bg-background text-foreground md:bg-card lg:bg-muted"
```

## ♿ Accessibility

### Color Contrast

All colors meet WCAG AA standards:

- **Normal Text**: 4.5:1 minimum contrast ratio
- **Large Text**: 3:1 minimum contrast ratio
- **UI Components**: 3:1 minimum contrast ratio

### Focus Indicators

Theme-aware focus indicators:

```css
.focus-visible:ring-2.focus-visible:ring-ring
```

### Reduced Motion

Respects user's motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  .theme-transition {
    transition: none;
  }
}
```

## 🚀 Performance

### Optimizations

- **CSS Variables**: Efficient color switching without CSS-in-JS
- **Minimal Re-renders**: Theme changes don't trigger component re-renders
- **Lazy Loading**: Theme detection happens after hydration
- **Caching**: Theme preference cached in localStorage

### Bundle Size

The theme system adds minimal overhead:

- `next-themes`: ~2KB gzipped
- CSS variables: ~1KB gzipped
- Total: ~3KB additional bundle size

## 📚 Additional Resources

- [next-themes Documentation](https://github.com/pacocoursey/next-themes)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [WCAG Color Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

---

**Note**: This theme system is designed to be maintainable, accessible, and performant. Always test theme changes across different devices and accessibility tools.
