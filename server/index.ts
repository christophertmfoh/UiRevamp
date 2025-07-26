import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

// Handle unhandled promise rejections globally
// This is needed for known Gemini SDK bug where AbortErrors can't be caught normally
process.on('unhandledRejection', (reason, promise) => {
  // Comprehensive filtering for all cancellation-related rejections
  if (reason && typeof reason === 'object') {
    // Check for direct AbortError
    if ('name' in reason && reason.name === 'AbortError') {
      console.log('Suppressed AbortError from cancelled request');
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
          message.includes('aborted without reason')) {
        console.log('Suppressed cancellation-related rejection:', reason.message);
        return;
      }
    }
    
    // Check for nested AbortError in cause chain
    if ('cause' in reason && reason.cause && typeof reason.cause === 'object' &&
        'name' in reason.cause && reason.cause.name === 'AbortError') {
      console.log('Suppressed nested AbortError');
      return;
    }
  }
  
  // Check string reasons for abort messages
  if (typeof reason === 'string' && reason.toLowerCase().includes('abort')) {
    console.log('Suppressed string abort reason:', reason);
    return;
  }
  
  // Log other genuine errors but don't crash the server
  console.error('Unhandled promise rejection (not cancellation-related):', reason);
});

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
