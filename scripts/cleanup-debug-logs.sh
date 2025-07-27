#!/bin/bash

# Fablecraft Debug Log Cleanup Script
# This script removes debug console.log statements while preserving error and warning logs

echo "🧹 Cleaning up debug logs for production deployment..."

# Find and remove debug console.log statements (preserve console.error and console.warn)
find server client src -name "*.ts" -o -name "*.tsx" | while read file; do
    if [[ -f "$file" ]]; then
        # Remove debug-specific console.log statements
        sed -i.bak '/console\.log.*DEBUG\|console\.log.*debug\|console\.log.*=== .*DEBUG/d' "$file"
        
        # Remove console.log statements with specific debug patterns
        sed -i '/console\.log.*Full response\|console\.log.*AI attempt\|console\.log.*Generated content/d' "$file"
        
        # Remove console.log statements with character data debugging
        sed -i '/console\.log.*character data\|console\.log.*personalityTraits/d' "$file"
        
        # Remove console.log statements with server debugging
        sed -i '/console\.log.*Server:/d' "$file"
        
        # Check if file was modified
        if ! cmp -s "$file" "$file.bak"; then
            echo "  ✓ Cleaned $file"
            rm "$file.bak"
        else
            rm "$file.bak"
        fi
    fi
done

echo "✨ Debug log cleanup complete!"

# Show remaining console.log statements for review
echo "📋 Remaining console.log statements (review these):"
find server client src -name "*.ts" -o -name "*.tsx" -exec grep -l "console\.log" {} \; 2>/dev/null | head -10

echo ""
echo "🚀 Your application is ready for production deployment!"
echo "   - Debug logs removed"
echo "   - Error and warning logs preserved"
echo "   - Ready for performance optimization"