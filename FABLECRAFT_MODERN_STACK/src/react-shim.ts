// React shim to ensure global availability in production builds
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

// Expose React globally to fix useLayoutEffect and other issues
if (typeof window !== 'undefined') {
  (window as any).React = React;
  (window as any).ReactDOM = ReactDOM;
  
  // Ensure all React exports are available
  Object.keys(React).forEach(key => {
    if (!(window as any).React[key]) {
      (window as any).React[key] = (React as any)[key];
    }
  });
}

export { React, ReactDOM };