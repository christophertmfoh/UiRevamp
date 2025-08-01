import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './shared/lib/theme/variables.css';
import App from './App.tsx';
import { ThemeProvider } from './app/providers/theme-provider';
import { AxeProvider } from './app/providers/axe-provider';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider
      attribute='data-theme'
      defaultTheme='light'
      enableSystem
      disableTransitionOnChange
    >
      <BrowserRouter>
        <AxeProvider>
          <App />
        </AxeProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
