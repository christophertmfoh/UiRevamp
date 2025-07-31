import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
// CRITICAL: Import theme CSS to ensure it's included in production
import './shared/lib/theme/variables.css';
import App from './App.tsx';
import { ThemeProvider } from './app/providers/theme-provider';

// Add error handling
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

console.log('Main.tsx: Starting application...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found!');
  throw new Error('Root element not found');
}

console.log('Main.tsx: Root element found, rendering app...');

try {
  createRoot(rootElement).render(
    <StrictMode>
      <ThemeProvider
        attribute='data-theme'
        defaultTheme='light'
        enableSystem
        disableTransitionOnChange
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </StrictMode>
  );
  console.log('Main.tsx: App rendered successfully');
} catch (error) {
  console.error('Main.tsx: Failed to render app:', error);
  // Show error in DOM
  rootElement.innerHTML = `
    <div style="padding: 20px; color: red;">
      <h1>Application Failed to Load</h1>
      <pre>${error}</pre>
    </div>
  `;
}
