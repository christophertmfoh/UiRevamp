import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { log } from "./vite";
import { 
  devCacheMiddleware, 
  optimizeStaticAssets, 
  performanceMonitoring, 
  memoryMonitoring 
} from "./dev-optimization";
import { securityHeaders, rateLimiting } from "./middleware/security";

const app = express();

// Enterprise security middleware - MUST come first
app.use(securityHeaders);
app.use(rateLimiting());

// Increase timeout for large requests
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Add timeout middleware to prevent 504 errors
app.use((req, res, next) => {
  // Set timeout for all requests to 60 seconds
  req.setTimeout(60000);
  res.setTimeout(60000);
  next();
});

// Phase 5: Development optimizations for creative workflow
if (process.env.NODE_ENV === 'development') {
  app.use(devCacheMiddleware(30000)); // 30 second cache
  app.use(optimizeStaticAssets());
  app.use(performanceMonitoring());
  app.use(memoryMonitoring());
}

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

  // Add health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      env: process.env.NODE_ENV || 'development'
    });
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // In development: ONLY serve API, no Vite integration
  // In production: Setup Vite for serving static files
  if (process.env.NODE_ENV !== "development") {
    log("Production mode: Setting up Vite for static file serving");
    const { setupVite, serveStatic } = await import("./vite");
    await setupVite(app, server);
    serveStatic(app);
  } else {
    log("Development mode: API-only server (client runs separately on 5173)");
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
