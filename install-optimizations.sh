#!/bin/bash

echo "🚀 Installing Performance Optimizations..."

# Install new dependencies
echo "📦 Installing dependencies..."
npm install lodash-es@^4.17.21
npm install --save-dev @types/lodash-es@^4.17.12

# Build the optimized version
echo "🏗️  Building optimized application..."
npm run build

# Run database migrations if needed
echo "📊 Updating database schema..."
npm run db:push

echo "✅ Optimization installation complete!"
echo ""
echo "🔍 Next steps:"
echo "1. Review the OPTIMIZATION_GUIDE.md for detailed information"
echo "2. Set up monitoring endpoints: /health and /metrics"
echo "3. Configure environment variables for production"
echo "4. Run performance tests with: npm run test:performance"
echo ""
echo "📈 Key improvements:"
echo "- Database connection pooling optimized"
echo "- AI request caching and rate limiting"
echo "- React Query configuration improved"
echo "- Bundle splitting for faster loading"
echo "- Performance monitoring added"
echo ""
echo "🌐 Monitoring endpoints:"
echo "- Health check: GET http://localhost:5000/health"
echo "- Metrics: GET http://localhost:5000/metrics"
echo ""
echo "Happy optimizing! 🎯"