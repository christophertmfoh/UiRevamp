/**
 * Performance Budget Configuration
 * Defines performance constraints for the application
 */

export const budgets = {
  // Bundle size budgets
  bundleSize: { 
    max: '50kb',      // Maximum size for auth feature bundle
    warn: '40kb'      // Warning threshold
  },
  
  // Page load time budgets
  firstLoad: { 
    max: '3s',        // Maximum time for first contentful paint
    warn: '2s'        // Warning threshold
  },
  
  // Individual component size budgets
  componentSize: { 
    max: '10kb',      // Maximum size for individual components
    warn: '8kb'       // Warning threshold
  },
  
  // Additional performance metrics
  metrics: {
    // Largest Contentful Paint
    lcp: {
      max: 2500,      // 2.5 seconds (Good)
      warn: 4000      // 4 seconds (Needs Improvement)
    },
    
    // First Input Delay
    fid: {
      max: 100,       // 100ms (Good)
      warn: 300       // 300ms (Needs Improvement)
    },
    
    // Cumulative Layout Shift
    cls: {
      max: 0.1,       // 0.1 (Good)
      warn: 0.25      // 0.25 (Needs Improvement)
    },
    
    // Time to Interactive
    tti: {
      max: 3800,      // 3.8 seconds
      warn: 7300      // 7.3 seconds
    }
  },
  
  // Resource hints
  resources: {
    images: {
      maxSize: '200kb',
      formats: ['webp', 'avif', 'jpg'],
      lazy: true
    },
    
    fonts: {
      maxSize: '100kb',
      preload: true,
      display: 'swap'
    },
    
    scripts: {
      maxSize: '200kb',
      async: true,
      defer: true
    }
  }
};

/**
 * Performance monitoring configuration
 */
export const monitoring = {
  // Enable performance observer
  enableObserver: true,
  
  // Metrics to track
  trackedMetrics: [
    'navigation-timing',
    'resource-timing',
    'paint-timing',
    'layout-shift',
    'first-input',
    'largest-contentful-paint'
  ],
  
  // Reporting threshold (only report if metric exceeds)
  reportingThreshold: {
    duration: 100,    // 100ms
    size: 10240       // 10KB
  }
};

/**
 * Build optimization settings
 */
export const optimizations = {
  // Code splitting strategy
  splitting: {
    // Split vendor chunks
    vendor: {
      react: ['react', 'react-dom', 'react-router-dom'],
      ui: ['@radix-ui/*', 'class-variance-authority', 'clsx'],
      forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
      state: ['zustand']
    },
    
    // Lazy load routes
    lazyRoutes: true,
    
    // Minimum chunk size
    minChunkSize: 20000  // 20KB
  },
  
  // Asset optimization
  assets: {
    // Image optimization
    images: {
      quality: 85,
      formats: ['webp', 'original'],
      sizes: [640, 750, 828, 1080, 1200]
    },
    
    // CSS optimization
    css: {
      purge: true,
      minify: true,
      extractCritical: true
    }
  },
  
  // Preload/prefetch strategy
  resourceHints: {
    preload: [
      '/fonts/inter-var.woff2',
      '/fonts/playfair-display.woff2'
    ],
    
    prefetch: [
      '/auth',  // Prefetch auth route
    ],
    
    preconnect: [
      'https://fonts.googleapis.com',
      'https://api.fablecraft.com'  // If using external API
    ]
  }
};

/**
 * Performance test helpers
 */
export const performanceTests = {
  /**
   * Check if bundle size is within budget
   */
  checkBundleSize: (size) => {
    const maxSize = parseInt(budgets.bundleSize.max);
    const warnSize = parseInt(budgets.bundleSize.warn);
    
    if (size > maxSize) {
      throw new Error(`Bundle size ${size}kb exceeds maximum ${budgets.bundleSize.max}`);
    }
    
    if (size > warnSize) {
      console.warn(`Bundle size ${size}kb exceeds warning threshold ${budgets.bundleSize.warn}`);
    }
    
    return true;
  },
  
  /**
   * Check component size
   */
  checkComponentSize: (componentName, size) => {
    const maxSize = parseInt(budgets.componentSize.max);
    
    if (size > maxSize) {
      throw new Error(`Component ${componentName} (${size}kb) exceeds maximum ${budgets.componentSize.max}`);
    }
    
    return true;
  }
};