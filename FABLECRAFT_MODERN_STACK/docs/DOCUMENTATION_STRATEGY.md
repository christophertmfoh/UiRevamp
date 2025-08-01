# Documentation Strategy

## Philosophy: Just-In-Time Documentation

We follow a **just-in-time documentation** approach, which means:

1. **Document as you build**, not before
2. **Document only what's needed**, not everything
3. **Keep documentation close to code**
4. **Automate where possible**

## Documentation Types

### 1. **Component Documentation**

Located next to each component file:

```
components/
├── ui/
│   ├── button/
│   │   ├── button.tsx
│   │   ├── button.test.tsx
│   │   └── button.stories.tsx    # Visual documentation
│   └── glass-card/
│       ├── glass-card.tsx
│       └── README.md              # Component-specific docs
```

#### What to Document:
- **Props** - TypeScript interfaces (self-documenting)
- **Usage examples** - In story files
- **Accessibility notes** - In component comments
- **Breaking changes** - In CHANGELOG

#### What NOT to Document:
- ❌ Obvious props (e.g., `children`, `className`)
- ❌ Internal implementation details
- ❌ Standard HTML attributes

### 2. **API Documentation**

Use JSDoc comments for public APIs:

```typescript
/**
 * Authenticates a user with email and password
 * @throws {AuthError} When credentials are invalid
 * @returns Promise with user data and token
 */
export async function login(email: string, password: string) {
  // Implementation
}
```

### 3. **Architecture Decisions**

Use ADRs (Architecture Decision Records):
- Location: `docs/adr/`
- Format: `XXX-decision-name.md`
- When: For significant technical decisions

### 4. **Quick Start Guides**

Location: Component or feature README files
Format: 
```markdown
## Quick Start
\`\`\`tsx
import { Button } from '@/components/ui/button';

<Button variant="primary">Click me</Button>
\`\`\`
```

## Documentation Templates

### Component README Template
```markdown
# Component Name

## Usage
\`\`\`tsx
// Quick example
\`\`\`

## Props
[Auto-generated from TypeScript]

## Accessibility
- Keyboard support: ...
- Screen reader: ...
- ARIA attributes: ...

## Related
- Link to design system
- Link to Figma
```

### Story File Template
```typescript
// component.stories.tsx
export default {
  title: 'Category/ComponentName',
  component: Component,
  parameters: {
    docs: {
      description: {
        component: 'Brief description for Storybook docs'
      }
    }
  }
};
```

## Automation

### 1. **Props Documentation**
TypeScript interfaces automatically document props:
```typescript
interface ButtonProps {
  /** Visual style variant */
  variant?: 'primary' | 'secondary';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

### 2. **Generated Documentation**
- Use `typedoc` for API documentation
- Props tables generated from TypeScript
- Storybook for component catalog

### 3. **Validation**
```json
// package.json scripts
{
  "docs:check": "typedoc --emit none",
  "docs:build": "typedoc && storybook build"
}
```

## When to Document

### ✅ **Document When:**
- Creating a new reusable component
- Adding complex business logic
- Making architectural decisions
- Creating public APIs
- Adding accessibility features

### ❌ **Don't Document When:**
- Code is self-explanatory
- Following standard patterns
- Internal implementation details
- Temporary code
- Obvious functionality

## Documentation Locations

| Type | Location | Format |
|------|----------|--------|
| Components | Next to component | `.stories.tsx` |
| APIs | In code | JSDoc comments |
| Architecture | `/docs/adr/` | Markdown |
| Setup | `/docs/` | Markdown |
| Changelog | `/CHANGELOG.md` | Keep a Changelog |

## Best Practices

1. **Keep it DRY** - Don't repeat what TypeScript already tells us
2. **Show, don't tell** - Use examples over descriptions
3. **Stay current** - Update docs with code changes
4. **Be concise** - One paragraph > three paragraphs
5. **Use visuals** - Storybook for visual components

## Review Checklist

Before merging:
- [ ] New components have stories
- [ ] Public APIs have JSDoc comments
- [ ] Breaking changes in CHANGELOG
- [ ] Complex logic has inline comments
- [ ] Accessibility notes included

## Tools

- **Storybook** - Component documentation and playground
- **TypeDoc** - API documentation from TypeScript
- **Markdown** - For guides and ADRs
- **JSDoc** - For inline API documentation
- **VS Code** - IntelliSense reads our TypeScript/JSDoc