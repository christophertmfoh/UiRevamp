import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Handle unhandled promise rejections globally on the client side
// This is needed for known Gemini SDK bug where AbortErrors bypass normal error handling
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  
  // Check for abort-related errors that should be suppressed
  if (reason && typeof reason === 'object') {
    // Check for AbortError
    if ('name' in reason && reason.name === 'AbortError') {
      console.log('Suppressed client-side AbortError from cancelled request');
      event.preventDefault(); // Prevent the error from showing in console
      return;
    }
    
    // Check for abort/cancellation messages
    if ('message' in reason && typeof reason.message === 'string') {
      const message = reason.message.toLowerCase();
      if (message.includes('signal is aborted') || 
          message.includes('user cancelled') ||
          message.includes('cancelled') ||
          message.includes('request cancelled') ||
          message.includes('operation was aborted') ||
          message.includes('aborted without reason') ||
          message.includes('user cancelled image generation')) {
        console.log('Suppressed client-side cancellation-related rejection:', reason.message);
        event.preventDefault(); // Prevent the error from showing in console
        return;
      }
    }
  }
  
  // Check string reasons for abort/cancellation messages
  if (typeof reason === 'string') {
    const lowerReason = reason.toLowerCase();
    if (lowerReason.includes('abort') || 
        lowerReason.includes('cancelled') || 
        lowerReason.includes('user cancelled image generation')) {
      console.log('Suppressed client-side string cancellation reason:', reason);
      event.preventDefault();
      return;
    }
  }
  
  // Let other genuine errors show normally
  console.error('Unhandled client-side promise rejection (not cancellation-related):', reason);
});

createRoot(document.getElementById("root")!).render(<App />);
