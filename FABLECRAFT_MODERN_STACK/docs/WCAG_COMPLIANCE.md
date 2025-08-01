# WCAG 2.1 Compliance Guidelines

## Overview

Fablecraft is committed to WCAG 2.1 Level AA compliance. This document outlines our accessibility requirements and testing procedures.

## Core Requirements

### 1. **Perceivable**

#### 1.1 Text Alternatives
- ✅ All images must have alt text
- ✅ Decorative images use `alt=""`
- ✅ Complex images have long descriptions

#### 1.2 Time-based Media
- ✅ Videos have captions
- ✅ Audio has transcripts

#### 1.3 Adaptable
- ✅ Proper semantic HTML structure
- ✅ Headings in logical order (h1 → h2 → h3)
- ✅ Lists use proper `<ul>`, `<ol>`, `<li>` elements

#### 1.4 Distinguishable
- ✅ Color contrast ratios:
  - Normal text: 4.5:1
  - Large text: 3:1
  - UI components: 3:1
- ✅ Text can resize to 200% without loss of functionality
- ✅ No information conveyed by color alone

### 2. **Operable**

#### 2.1 Keyboard Accessible
- ✅ All functionality available via keyboard
- ✅ No keyboard traps
- ✅ Skip links for repetitive content

#### 2.2 Enough Time
- ✅ Users can extend time limits
- ✅ Auto-updating content can be paused

#### 2.3 Seizures
- ✅ No content flashes more than 3 times per second

#### 2.4 Navigable
- ✅ Page has descriptive title
- ✅ Focus order is logical
- ✅ Focus indicators are visible
- ✅ Link purpose is clear from context

### 3. **Understandable**

#### 3.1 Readable
- ✅ Page language is identified (`lang` attribute)
- ✅ Language changes are marked

#### 3.2 Predictable
- ✅ Navigation is consistent
- ✅ Components behave predictably
- ✅ No unexpected context changes

#### 3.3 Input Assistance
- ✅ Form labels are descriptive
- ✅ Errors are clearly identified
- ✅ Help text is available
- ✅ Error prevention for important actions

### 4. **Robust**

#### 4.1 Compatible
- ✅ Valid HTML
- ✅ Proper ARIA usage
- ✅ Works with assistive technologies

## Component-Specific Requirements

### Forms
```tsx
// ✅ Good: Label associated with input
<label htmlFor="email">Email</label>
<input id="email" type="email" required aria-describedby="email-error" />
<span id="email-error" role="alert">Please enter a valid email</span>

// ❌ Bad: No label association
<label>Email</label>
<input type="email" />
```

### Buttons
```tsx
// ✅ Good: Descriptive text
<button>Save changes</button>

// ❌ Bad: No context
<button>Click here</button>
```

### Images
```tsx
// ✅ Good: Descriptive alt text
<img src="chart.png" alt="Sales increased 25% from Q1 to Q2" />

// ✅ Good: Decorative image
<img src="border.png" alt="" role="presentation" />
```

### Focus Management
```tsx
// ✅ Good: Visible focus indicator
.button:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

// ❌ Bad: No focus indicator
.button:focus {
  outline: none;
}
```

## Testing Checklist

### Automated Testing
- [ ] Run axe-core tests (`npm test`)
- [ ] Check color contrast with axe DevTools
- [ ] Validate HTML with W3C validator

### Manual Testing
- [ ] **Keyboard Navigation**
  - Tab through all interactive elements
  - Ensure logical tab order
  - Test escape key for modals
  - Verify no keyboard traps

- [ ] **Screen Reader Testing**
  - Test with NVDA (Windows)
  - Test with JAWS (Windows)
  - Test with VoiceOver (macOS/iOS)
  - Verify all content is announced
  - Check form labels and errors

- [ ] **Visual Testing**
  - Zoom to 200% - ensure no horizontal scroll
  - Test with Windows High Contrast mode
  - Verify focus indicators are visible
  - Check color contrast ratios

- [ ] **Cognitive Testing**
  - Clear and consistent navigation
  - Predictable interactions
  - Plain language used
  - Error messages are helpful

## Common Violations to Avoid

1. **Missing Alt Text**
   ```tsx
   // ❌ Bad
   <img src="logo.png" />
   
   // ✅ Good
   <img src="logo.png" alt="Fablecraft logo" />
   ```

2. **Poor Color Contrast**
   ```css
   /* ❌ Bad: Light gray on white */
   color: #cccccc;
   background: #ffffff;
   
   /* ✅ Good: Dark gray on white */
   color: #595959;
   background: #ffffff;
   ```

3. **Missing Form Labels**
   ```tsx
   // ❌ Bad: Placeholder as label
   <input placeholder="Email" />
   
   // ✅ Good: Proper label
   <label htmlFor="email">Email</label>
   <input id="email" placeholder="user@example.com" />
   ```

4. **Focus Traps**
   ```tsx
   // ❌ Bad: Can't escape modal
   <div role="dialog">...</div>
   
   // ✅ Good: Escape key handled
   <div role="dialog" onKeyDown={handleEscape}>...</div>
   ```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Axe DevTools](https://www.deque.com/axe/devtools/)

## Reporting Issues

If you find an accessibility issue:
1. Check if it's already reported
2. Create an issue with the `accessibility` label
3. Include:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - WCAG criterion violated
   - Screenshot if applicable