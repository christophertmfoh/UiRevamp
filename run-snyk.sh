#!/bin/bash

# Snyk Security Scanner for Fablecraft
# This script provides easy access to Snyk security features

echo "🔒 Fablecraft Security Scanner powered by Snyk"
echo "============================================"

# Check if Snyk CLI is installed
if ! command -v npx snyk &> /dev/null; then
    echo "❌ Snyk is not installed. Please run: npm install snyk"
    exit 1
fi

# Display menu options
echo ""
echo "Choose an option:"
echo "1) Run security test (check for vulnerabilities)"
echo "2) Fix vulnerabilities interactively"
echo "3) Monitor project (send to Snyk dashboard)"
echo "4) Test and show dependency tree"
echo "5) Test with detailed vulnerability info"
echo "6) Generate security report (JSON)"
echo ""

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo "🔍 Running security test..."
        npx snyk test
        ;;
    2)
        echo "🔧 Starting interactive fix wizard..."
        npx snyk wizard
        ;;
    3)
        echo "📊 Monitoring project..."
        npx snyk monitor
        ;;
    4)
        echo "🌳 Testing with dependency tree..."
        npx snyk test --print-deps
        ;;
    5)
        echo "📋 Testing with detailed vulnerability info..."
        npx snyk test --show-vulnerable-paths=all
        ;;
    6)
        echo "📄 Generating JSON security report..."
        npx snyk test --json > snyk-report.json
        echo "✅ Report saved to snyk-report.json"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "✅ Security scan complete!"
echo ""
echo "💡 Tips:"
echo "- Run option 1 regularly to check for new vulnerabilities"
echo "- Use option 2 to fix issues with guided assistance"
echo "- Option 3 uploads your project to Snyk dashboard for continuous monitoring"
echo "- For CI/CD integration, use: npx snyk test --severity-threshold=high"