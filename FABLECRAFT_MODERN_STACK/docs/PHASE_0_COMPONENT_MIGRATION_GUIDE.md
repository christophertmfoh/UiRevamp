# Phase 0 Component Migration Guide

## Overview

Phase 0 successfully extracted 6 reusable components from the landing page to ensure visual consistency across the application, especially for the upcoming auth page. This guide helps developers use these components correctly.

## Components Created

### 1. NavigationHeader
**Location**: `src/components/layout/navigation-header.tsx`

**Usage**:
```tsx
import { NavigationHeader } from '@/components/layout/navigation-header';

// Landing page usage
<NavigationHeader
  isAuthenticated={isAuthenticated}
  user={user}
  onAuthClick={handleAuth}
  onLogout={handleLogout}
  onNavigate={handleNavigate}
/>

// Auth page usage (no auth button)
<NavigationHeader
  showAuthButton={false}
  onNavigate={handleNavigate}
/>
```

**Key Props**:
- `showAuthButton`: Hide auth button on auth pages
- `showNavItems`: Hide navigation items for minimal layouts
- `isAuthenticated`, `user`: For user state management

### 2. GlassCard
**Location**: `src/components/ui/glass-card.tsx`

**Usage**:
```tsx
import { GlassCard } from '@/components/ui/glass-card';

// Light variant (default)
<GlassCard className="p-6">
  <p>Subtle glass effect content</p>
</GlassCard>

// Heavy variant for auth forms
<GlassCard variant="heavy" hover className="p-8">
  <AuthForm />
</GlassCard>

// Elevated variant for featured content
<GlassCard variant="elevated">
  <PremiumContent />
</GlassCard>
```

**Variants**:
- `light`: bg-card/95 backdrop-blur-md (default)
- `heavy`: bg-card/90 backdrop-blur-lg 
- `elevated`: surface-elevated backdrop-blur-lg

### 3. GradientButton
**Location**: `src/components/ui/gradient-button.tsx`

**Usage**:
```tsx
import { GradientButton } from '@/components/ui/gradient-button';

// Primary CTA
<GradientButton size="lg">
  Start Your Journey
</GradientButton>

// With icon
<GradientButton>
  <Sparkles className="mr-2 h-4 w-4" />
  Create Magic
</GradientButton>

// Custom gradient
<GradientButton gradientColors="from-primary/30 to-transparent">
  Custom Gradient
</GradientButton>
```

**Features**:
- Extends base Button component
- Gradient overlay on hover
- All Button props supported

### 4. FooterSection with External Content
**Location**: 
- Component: `src/features-modern/landing/components/footer-section.tsx`
- Content: `src/components/layout/footer-content.ts`

**Usage**:
```tsx
import { FooterSection } from '@/features-modern/landing/components/footer-section';

// Default usage
<FooterSection />

// Custom tagline
<FooterSection tagline="Your creative partner" />

// To update footer content, edit: src/components/layout/footer-content.ts
```

**Content Structure**:
```ts
export const footerLinks = {
  product: ['Character Creator', 'World Builder', ...],
  company: ['About Us', 'Careers', ...],
  support: ['Help Center', 'Documentation', ...],
  legal: ['Privacy Policy', 'Terms of Service', ...]
};
```

### 5. SectionContainer
**Location**: `src/components/layout/section-container.tsx`

**Usage**:
```tsx
import { SectionContainer, SectionContent } from '@/components/layout/section-container';

// Standard section
<SectionContainer spacing="default">
  <SectionContent>
    <h2>Section Title</h2>
    <p>Section content</p>
  </SectionContent>
</SectionContainer>

// Hero section
<SectionContainer spacing="hero" width="narrow">
  <HeroContent />
</SectionContainer>

// Compact with custom element
<SectionContainer as="article" spacing="compact">
  <ArticleContent />
</SectionContainer>
```

**Spacing Options**:
- `default`: section-spacing (128px)
- `hero`: section-spacing-hero (96px)
- `compact`: section-spacing-compact (64px)

### 6. HeadingGroup
**Location**: `src/components/ui/heading-group.tsx`

**Usage**:
```tsx
import { HeadingGroup } from '@/components/ui/heading-group';

// Section header
<HeadingGroup
  badge="Revolutionary Creative Technology"
  title="The Creative Industry's First Complete Suite"
  description="Break free from scattered tools..."
/>

// Page heading (h1)
<HeadingGroup
  badge="Welcome"
  title="Start Your Creative Journey"
  headingLevel="h1"
  size="large"
  showDot
/>

// Without badge
<HeadingGroup
  title="Simple Section Title"
  description="Optional description text"
  size="medium"
/>
```

**Size Options**:
- `large`: For hero sections
- `default`: Standard sections
- `medium`: Subsections
- `small`: Minor sections
- `compact`: Tight spaces

## Migration Examples

### Before (Landing Page Pattern):
```tsx
<section className="relative z-10 max-w-7xl mx-auto px-8 py-24">
  <div className="text-center space-y-16">
    <div className="space-y-6">
      <Badge className="bg-card/95 text-foreground border-border font-bold backdrop-blur-md shadow-md">
        Revolutionary Creative Technology
      </Badge>
      <h2 className="text-4xl md:text-5xl font-black text-heading-primary">
        The Creative Industry's First Complete Suite
      </h2>
      <p className="text-muted-foreground max-w-4xl mx-auto">
        Break free from scattered tools...
      </p>
    </div>
    {/* Section content */}
  </div>
</section>
```

### After (Using Components):
```tsx
<SectionContainer spacing="default">
  <SectionContent>
    <HeadingGroup
      badge="Revolutionary Creative Technology"
      title="The Creative Industry's First Complete Suite"
      description="Break free from scattered tools..."
    />
    {/* Section content */}
  </SectionContent>
</SectionContainer>
```

## Best Practices

1. **Consistency**: Always use these components instead of recreating patterns
2. **Spacing**: Use SectionContainer for all major page sections
3. **Headings**: Use HeadingGroup for all badge+title+description patterns
4. **Glass Effects**: Use GlassCard variants consistently across the app
5. **CTAs**: Use GradientButton for primary call-to-action buttons

## Testing Checklist

When replacing components:
- [ ] Visual appearance matches original
- [ ] Responsive behavior maintained
- [ ] Theme switching works correctly
- [ ] Accessibility features preserved
- [ ] No console errors or warnings
- [ ] Performance not degraded

## Next Steps

1. Start with new pages (like auth) to use components from the beginning
2. Gradually migrate existing pages section by section
3. Run visual regression tests after each migration
4. Update Storybook stories as needed