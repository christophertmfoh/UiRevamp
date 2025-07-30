import type { Express } from 'express';
import { createServer, type Server } from 'http';
import { ModernServer } from './modernServer';
import { ssrRenderer } from './streaming/reactSSR';
import ConcurrentAPIHandler from './streaming/concurrentAPI';
import { characterHandler, worldBibleHandler, projectHandler } from './websocket/realtimeHandlers';
import { storage } from './storage/factory';
import { log } from './vite';

/**
 * Modern Routes Integration for React 18 Backend
 * Combines existing FableCraft functionality with modern React 18 features
 */

interface ModernRouteOptions {
  enableSSR?: boolean;
  enableWebSocket?: boolean;
  enableStreamingAPI?: boolean;
  enableConcurrentOptimization?: boolean;
}

export class ModernRouteManager {
  private modernServer: ModernServer;
  private options: ModernRouteOptions;

  constructor(options: ModernRouteOptions = {}) {
    this.options = {
      enableSSR: true,
      enableWebSocket: true,
      enableStreamingAPI: true,
      enableConcurrentOptimization: true,
      ...options,
    };
    
    this.modernServer = new ModernServer();
  }

  /**
   * Setup all modern routes and middleware
   */
  public async setupModernRoutes(legacyApp: Express): Promise<Server> {
    const app = this.modernServer.getApp();
    const server = this.modernServer.getServer();

    // Copy all existing middleware and routes from legacy app
    this.integrateWithLegacyApp(legacyApp, app);

    // Setup modern features
    if (this.options.enableConcurrentOptimization) {
      this.setupConcurrentAPI(app);
    }

    if (this.options.enableStreamingAPI) {
      this.setupStreamingAPI(app);
    }

    if (this.options.enableSSR) {
      this.setupSSRRoutes(app);
    }

    if (this.options.enableWebSocket) {
      this.setupWebSocketHandlers();
    }

    // Setup modern project-specific routes
    this.setupFableCraftModernRoutes(app);

    log('🚀 Modern React 18 backend integration complete');
    return server;
  }

  /**
   * Integrate with existing legacy Express app
   */
  private integrateWithLegacyApp(legacyApp: Express, modernApp: Express): void {
    // Copy middleware stack
    legacyApp._router.stack.forEach((layer: any) => {
      if (layer.route) {
        // Copy routes
        const method = Object.keys(layer.route.methods)[0];
        const path = layer.route.path;
        modernApp[method as keyof Express](path, ...layer.route.stack.map((l: any) => l.handle));
      } else if (layer.name === 'router') {
        // Copy router middleware
        modernApp.use(layer.regexp, layer.handle);
      } else {
        // Copy other middleware
        modernApp.use(layer.handle);
      }
    });

    log('🔗 Legacy app integration complete');
  }

  /**
   * Setup concurrent API optimization
   */
  private setupConcurrentAPI(app: Express): void {
    // Apply concurrent middleware to all API routes
    app.use('/api/*', 
      ConcurrentAPIHandler.performanceMiddleware(),
      ConcurrentAPIHandler.deduplicationMiddleware(),
      ConcurrentAPIHandler.cachingMiddleware({
        ttl: 30000, // 30 seconds
        key: 'api-cache',
        shouldCache: (req) => req.method === 'GET' && !req.path.includes('stream'),
      })
    );

    log('⚡ Concurrent API optimization enabled');
  }

  /**
   * Setup streaming API endpoints
   */
  private setupStreamingAPI(app: Express): void {
    // Enable streaming for large data endpoints
    app.use('/api/stream/*', 
      ConcurrentAPIHandler.streamingMiddleware({
        enableStreaming: true,
        chunkSize: 50,
        timeout: 30000,
      })
    );

    // Character streaming endpoint
    app.get('/api/stream/characters/:projectId', async (req, res) => {
      await ConcurrentAPIHandler.streamCharacters(
        req,
        res,
        async (projectId: string, cursor?: string) => {
          const characters = await storage.getCharacters(projectId);
          return {
            data: characters.slice(0, 20), // Simulate pagination
            hasMore: false,
            nextCursor: undefined,
          };
        }
      );
    });

    // Project data streaming endpoint
    app.get('/api/stream/project/:projectId', async (req, res) => {
      await ConcurrentAPIHandler.concurrentProjectLoad(
        req,
        res,
        (id: string) => storage.getProject(id),
        (projectId: string) => storage.getCharacters(projectId),
        (projectId: string) => storage.getOutlines(projectId),
      );
    });

    // AI generation streaming endpoint
    app.post('/api/stream/generate/character', async (req, res) => {
      await ConcurrentAPIHandler.streamAIGeneration(
        req,
        res,
        async (data: any, onProgress: (progress: any) => void) => {
          // Simulate AI generation with progress
          const steps = [
            { step: 'analyzing', progress: 25, message: 'Analyzing character traits...' },
            { step: 'generating', progress: 50, message: 'Generating character details...' },
            { step: 'enhancing', progress: 75, message: 'Enhancing character profile...' },
            { step: 'complete', progress: 100, message: 'Character generation complete!' },
          ];

          for (const step of steps) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            onProgress(step);
          }

          return {
            character: {
              id: `char-${Date.now()}`,
              name: 'Generated Character',
              personality: 'Brave and determined',
              backstory: 'A hero from distant lands...',
            },
          };
        }
      );
    });

    log('📊 Streaming API endpoints enabled');
  }

  /**
   * Setup React 18 SSR routes
   */
  private setupSSRRoutes(app: Express): void {
    // Character page SSR
    app.get('/modern/character/:id', async (req, res) => {
      const characterData = await storage.getCharacter(req.params.id || '');
      ssrRenderer.renderCharacterPage(req, res, characterData);
    });

    // Project page SSR
    app.get('/modern/project/:id', async (req, res) => {
      const projectData = await storage.getProject(req.params.id || '');
      ssrRenderer.renderProjectPage(req, res, projectData);
    });

    // World bible page SSR
    app.get('/modern/world/:projectId', async (req, res) => {
      const worldData = null; // World bible integration to be implemented
      ssrRenderer.renderWorldBiblePage(req, res, worldData);
    });

    // Generic modern page SSR
    this.modernServer.setupSSRRoute(ModernFableCraftApp);

    log('🎭 React 18 SSR routes enabled');
  }

  /**
   * Setup WebSocket real-time handlers
   */
  private setupWebSocketHandlers(): void {
    const wss = this.modernServer.getWebSocketServer();

    // Extend WebSocket message handling
    wss.on('connection', (ws, req) => {
      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString());
          const clientId = message.clientId;

          // Route to appropriate handler
          switch (message.type) {
            case 'CHARACTER_FIELD_UPDATE':
              await characterHandler.handleCharacterFieldUpdate(
                clientId, 
                message, 
                (roomId, msg) => this.broadcastToRoom(roomId, msg)
              );
              break;

            case 'CHARACTER_GENERATION_START':
              await characterHandler.handleCharacterGeneration(
                clientId,
                message,
                (roomId, msg) => this.broadcastToRoom(roomId, msg)
              );
              break;

            case 'TYPING_INDICATOR':
              characterHandler.handleTypingIndicator(
                clientId,
                message,
                (roomId, msg) => this.broadcastToRoom(roomId, msg)
              );
              break;

            case 'DOCUMENT_LOCK':
              characterHandler.handleDocumentLock(
                clientId,
                message,
                (roomId, msg) => this.broadcastToRoom(roomId, msg)
              );
              break;

            case 'WORLD_ELEMENT_UPDATE':
              await worldBibleHandler.handleWorldElementUpdate(
                clientId,
                message,
                (roomId, msg) => this.broadcastToRoom(roomId, msg)
              );
              break;

            case 'PROJECT_STATUS_UPDATE':
              await projectHandler.handleProjectStatusUpdate(
                clientId,
                message,
                (roomId, msg) => this.broadcastToRoom(roomId, msg)
              );
              break;

            default:
              log(`⚠️ Unknown WebSocket message type: ${message.type}`);
          }
        } catch (error) {
          log(`❌ WebSocket message handling error: ${error}`);
        }
      });
    });

    log('🔌 WebSocket real-time handlers enabled');
  }

  /**
   * Setup FableCraft-specific modern routes
   */
  private setupFableCraftModernRoutes(app: Express): void {
    // Modern API status endpoint
    app.get('/api/modern/status', (req, res) => {
      res.json({
        status: 'operational',
        features: this.options,
        stats: {
          server: this.modernServer.getStats(),
          api: ConcurrentAPIHandler.getStats(),
        },
        react18Features: {
          ssr: this.options.enableSSR,
          streaming: this.options.enableStreamingAPI,
          webSocket: this.options.enableWebSocket,
          concurrent: this.options.enableConcurrentOptimization,
        },
      });
    });

    // Health check with React 18 capabilities
    app.get('/api/modern/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        capabilities: {
          serverSideRendering: true,
          streamingAPI: true,
          webSocketRealtime: true,
          concurrentOptimization: true,
        },
        performance: process.cpuUsage(),
        memory: process.memoryUsage(),
      });
    });

    log('🎨 FableCraft modern routes enabled');
  }

  /**
   * Broadcast message to WebSocket room
   */
  private broadcastToRoom(roomId: string, message: any): void {
    // This would integrate with the ModernServer's room broadcasting
    log(`📡 Broadcasting to room ${roomId}: ${message.type}`);
  }

  /**
   * Get the modern server instance
   */
  public getModernServer(): ModernServer {
    return this.modernServer;
  }

  /**
   * Cleanup resources
   */
  public cleanup(): void {
    this.modernServer.cleanup();
  }
}

/**
 * Modern FableCraft App component for SSR
 * This would be your actual React component
 */
const ModernFableCraftApp: React.ComponentType<any> = (props) => {
  return React.createElement('div', {
    id: 'modern-fablecraft-app',
    'data-url': props.url,
  }, [
    React.createElement('h1', { key: 'title' }, 'FableCraft - Modern React 18'),
    React.createElement('p', { key: 'description' }, 'Creative writing platform with modern React features'),
    React.createElement('div', { key: 'loading' }, 'Loading modern features...'),
  ]);
};

export default ModernRouteManager;