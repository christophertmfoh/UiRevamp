# Visual Regression Testing Setup

## Overview

Visual regression testing is configured using Chromatic, which integrates with Storybook to catch visual changes in components.

## Setup Status

✅ **Already Installed**: `@chromatic-com/storybook@^4.1.0`

## How It Works

1. **Storybook Stories** - Each story is a visual test case
2. **Chromatic** - Takes snapshots of each story
3. **Comparison** - Compares snapshots between commits
4. **Review** - Visual changes require approval

## Usage

### 1. Local Visual Testing

```bash
# Run Storybook locally
npm run storybook

# Build Storybook for visual testing
npm run build-storybook
```

### 2. Chromatic Setup (When Ready)

```bash
# Install Chromatic CLI
npm install --save-dev chromatic

# Run Chromatic (requires project token)
npx chromatic --project-token=<your-token>
```

### 3. Writing Visual Tests

Every Storybook story is automatically a visual test:

```tsx
// Component.stories.tsx
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Hover: Story = {
  args: {
    children: 'Hover State',
  },
  parameters: {
    pseudo: { hover: true }, // Test hover state
  },
};

export const Focus: Story = {
  args: {
    children: 'Focus State',
  },
  parameters: {
    pseudo: { focus: true }, // Test focus state
  },
};
```

## Best Practices

1. **Story Coverage** - Create stories for all component states
2. **Responsive Testing** - Test at different viewport sizes
3. **Theme Testing** - Test in light and dark themes
4. **State Testing** - Test hover, focus, active states
5. **Edge Cases** - Test with long text, missing data, etc.

## Component Story Checklist

- [ ] Default state
- [ ] All variant props
- [ ] All size props
- [ ] Loading states
- [ ] Error states
- [ ] Disabled states
- [ ] Hover/focus/active states
- [ ] Light/dark theme
- [ ] Mobile/tablet/desktop views

## Accessibility Integration

The `@storybook/addon-a11y` addon runs alongside visual tests:

```tsx
// Preview.ts already configured
parameters: {
  a11y: {
    // Axe rules configuration
    config: {
      rules: [
        {
          id: 'color-contrast',
          enabled: true,
        },
      ],
    },
  },
},
```

## CI/CD Integration

Add to your CI pipeline:

```yaml
# .github/workflows/chromatic.yml
name: 'Chromatic'
on: push

jobs:
  chromatic:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build-storybook
      - uses: chromaui/action@v1
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```

## Current Status

- ✅ Chromatic addon installed
- ✅ Storybook configured
- ✅ Button component has stories
- ⏳ Awaiting Chromatic project setup
- ⏳ Awaiting CI configuration

## Next Steps

1. Sign up for Chromatic account
2. Create project and get token
3. Run initial baseline
4. Set up CI integration