import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from './components/theme-provider';
import { ToastProvider } from './components/ui/Toast';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { AppContent } from './components/AppContent';

// Force scrollbar styling with JavaScript - comprehensive approach
const applyScrollbarStyles = () => {
  // Remove any existing styles first
  const existingStyles = document.querySelectorAll('style[data-scrollbar]');
  existingStyles.forEach(el => el.remove());
  
  // Create comprehensive style override
  const style = document.createElement('style');
  style.setAttribute('data-scrollbar', 'true');
  
  // Multi-approach CSS that covers all browsers and scenarios
  style.textContent = `
    /* Chromium-based browsers - Document level */
    html::-webkit-scrollbar,
    body::-webkit-scrollbar,
    ::-webkit-scrollbar {
      width: 8px !important;
      height: 8px !important;
      background: transparent !important;
    }
    
    html::-webkit-scrollbar-track,
    body::-webkit-scrollbar-track,
    ::-webkit-scrollbar-track {
      background: transparent !important;
    }
    
    html::-webkit-scrollbar-thumb,
    body::-webkit-scrollbar-thumb,
    ::-webkit-scrollbar-thumb {
      background: #a0967d !important;
      border-radius: 6px !important;
      border: none !important;
    }
    
    html::-webkit-scrollbar-thumb:hover,
    body::-webkit-scrollbar-thumb:hover,
    ::-webkit-scrollbar-thumb:hover {
      background: #8b8269 !important;
    }
    
    html::-webkit-scrollbar-corner,
    body::-webkit-scrollbar-corner,
    ::-webkit-scrollbar-corner {
      background: transparent !important;
    }
    
    /* Firefox */
    html, body {
      scrollbar-width: thin !important;
      scrollbar-color: #a0967d transparent !important;
    }
    
    /* All other elements */
    *:not(html):not(body) {
      scrollbar-width: thin !important;
      scrollbar-color: #a0967d transparent !important;
    }
    
    *:not(html):not(body)::-webkit-scrollbar {
      width: 8px !important;
      height: 8px !important;
      background: transparent !important;
    }
    
    *:not(html):not(body)::-webkit-scrollbar-track {
      background: transparent !important;
    }
    
    *:not(html):not(body)::-webkit-scrollbar-thumb {
      background: #a0967d !important;
      border-radius: 6px !important;
    }
    
    *:not(html):not(body)::-webkit-scrollbar-thumb:hover {
      background: #8b8269 !important;
    }
  `;
  
  // Insert at beginning of head for maximum priority
  document.head.insertBefore(style, document.head.firstChild);
  
  // Also try direct DOM manipulation for the main scrollbar
  if (document.documentElement) {
    document.documentElement.style.setProperty('scrollbar-width', 'thin', 'important');
    document.documentElement.style.setProperty('scrollbar-color', '#a0967d transparent', 'important');
  }
  
  if (document.body) {
    document.body.style.setProperty('scrollbar-width', 'thin', 'important');
    document.body.style.setProperty('scrollbar-color', '#a0967d transparent', 'important');
  }
  
  // Remove any existing scrollbar styles
  const existingScrollbarStyles = document.querySelectorAll('style[data-scrollbar]');
  existingScrollbarStyles.forEach(el => el.remove());
  
  style.setAttribute('data-scrollbar', 'true');
  document.head.appendChild(style);
};

export default function App() {
  // Initialize scrollbar styling
  React.useEffect(() => {
    applyScrollbarStyles();
    
    const timer = setTimeout(() => {
      applyScrollbarStyles();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="dark" 
        enableSystem
        themes={[
          'light', 
          'dark',
          'system',
          'arctic-focus',
          'golden-hour',
          'midnight-ink',
          'forest-manuscript',
          'starlit-prose',
          'coffee-house'
        ]}
      >
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <TooltipProvider>
              <Toaster />
              <AppContent />
            </TooltipProvider>
          </ToastProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}