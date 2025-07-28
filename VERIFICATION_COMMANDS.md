# Professional Verification Commands

## 1. Check What Files Are Actually Imported
```bash
# See what your App.tsx actually imports
grep -r "import.*from.*pages\|import.*from.*components" client/src/App.tsx

# Find files that import workspace.tsx (should be none)
find client/src -name "*.tsx" -type f | xargs grep -l "workspace"

# Find files that import ProjectsPageRedesign (should be none)  
find client/src -name "*.tsx" -type f | xargs grep -l "ProjectsPageRedesign"
```

## 2. Unused File Detection
```bash
# Professional unused file detection
npx unimported client/src/

# Alternative: Find files not referenced anywhere
find client/src -name "*.tsx" -type f | while read file; do
  basename=$(basename "$file" .tsx)
  if ! grep -r "$basename" client/src/ --include="*.tsx" --include="*.ts" | grep -v "$file:" > /dev/null; then
    echo "UNUSED: $file"
  fi
done
```

## 3. Duplicate Code Analysis  
```bash
# Generate detailed duplicate report
npx jscpd --min-lines 10 --min-tokens 50 --reporters html,json --output ./analysis client/src/

# View the HTML report
# Open: analysis/jscpd-report.html in browser
```

## 4. Bundle Analysis
```bash  
# Analyze what's actually bundled (Vite)
npx vite-bundle-analyzer

# Or check bundle size
npm run build
ls -la dist/
```

## 5. Dependency Analysis
```bash
# Check for circular dependencies
npx madge --circular client/src/

# Full dependency tree
npx madge client/src/ --image deps.png
```

## 6. ESLint Unused Variables/Imports
```bash
# Check for unused imports/variables
npx eslint client/src/ --ext .tsx,.ts --rule "no-unused-vars: error"
```

## 7. File Size Analysis
```bash
# Find largest files (potential duplicates)
find client/src -name "*.tsx" -exec wc -l {} + | sort -nr | head -20

# Check specific file sizes
du -sh client/src/pages/workspace.tsx
du -sh client/src/components/project/Project*.tsx
```