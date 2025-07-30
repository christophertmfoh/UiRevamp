import express from 'express';
import { registerRoutes } from './routes';
import ModernRouteManager from './modernRoutes';
import { log } from './vite';

/**
 * Modern FableCraft Server Entry Point
 * Integrates React 18 features with existing enterprise-grade backend
 */

async function startModernServer() {
  try {
    // Create legacy app first
    const legacyApp = express();
    await registerRoutes(legacyApp);

    // Create modern route manager
    const modernManager = new ModernRouteManager({
      enableSSR: true,
      enableWebSocket: true,  
      enableStreamingAPI: true,
      enableConcurrentOptimization: true,
    });

    // Setup modern routes with legacy integration
    const server = await modernManager.setupModernRoutes(legacyApp);

    const port = process.env.PORT || 5000;
    
    server.listen(port, () => {
      log(`🚀 Modern FableCraft server running on port ${port}`);
      log(`📊 React 18 SSR: http://localhost:${port}/modern/*`);
      log(`🔌 WebSocket: ws://localhost:${port}/ws`);
      log(`📡 Streaming API: http://localhost:${port}/api/stream/*`);
      log(`💡 Modern Status: http://localhost:${port}/api/modern/status`);
    });

    // Cleanup on exit
    process.on('SIGTERM', () => {
      log('🛑 Shutting down modern server...');
      modernManager.cleanup();
      server.close();
    });

    process.on('SIGINT', () => {
      log('🛑 Shutting down modern server...');
      modernManager.cleanup();
      server.close();
    });

  } catch (error) {
    console.error('❌ Failed to start modern server:', error);
    process.exit(1);
  }
}

// Start the modern server
if (require.main === module) {
  startModernServer();
}

export { startModernServer };