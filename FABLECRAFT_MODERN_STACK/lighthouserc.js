module.exports = {
  ci: {
    collect: {
      // Where to find the built app
      staticDistDir: './dist',
      
      // URLs to test (relative to staticDistDir)
      url: ['/', '/login'],
      
      // Number of times to run Lighthouse per URL
      numberOfRuns: 3,
    },
    
    assert: {
      // Use recommended assertions
      preset: 'lighthouse:recommended',
      
      // Custom assertions
      assertions: {
        // Ensure good performance
        'categories:performance': ['error', { minScore: 0.8 }],
        
        // Ensure good accessibility
        'categories:accessibility': ['error', { minScore: 0.9 }],
        
        // Ensure good SEO
        'categories:seo': ['error', { minScore: 0.9 }],
        
        // Ensure good best practices
        'categories:best-practices': ['error', { minScore: 0.9 }],
        
        // Specific metrics
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'interactive': ['error', { maxNumericValue: 3500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
      },
    },
    
    upload: {
      // Store results temporarily (no server needed)
      target: 'temporary-public-storage',
    },
  },
}