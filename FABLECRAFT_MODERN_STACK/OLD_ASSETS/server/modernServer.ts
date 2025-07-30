import express, { type Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { renderToPipeableStream } from 'react-dom/server';
import React from 'react';
import { log } from './vite';
import type { Server } from 'http';

interface WebSocketMessage {
  type: string;
  payload: any;
  clientId?: string;
  timestamp: number;
}

interface ConnectedClient {
  ws: any;
  userId?: string;
  lastPing: number;
  subscriptions: Set<string>;
}

/**
 * Modern Express.js Server with React 18 SSR Streaming Support
 * Implements WebSocket real-time features and concurrent API optimization
 */
export class ModernServer {
  private app: express.Express;
  private server: Server;
  private wss!: WebSocketServer;
  private clients: Map<string, ConnectedClient> = new Map();
  private rooms: Map<string, Set<string>> = new Map();
  private pingInterval!: NodeJS.Timeout;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.setupMiddleware();
    this.setupWebSocket();
    this.setupPingPong();
  }

  private setupMiddleware(): void {
    // Enable streaming responses for React 18
    this.app.use((req, res, next) => {
      res.setHeader('Transfer-Encoding', 'chunked');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      next();
    });

    // Concurrent request optimization
    this.app.use((req, res, next) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      next();
    });
  }

  private setupWebSocket(): void {
    this.wss = new WebSocketServer({ 
      server: this.server,
      path: '/ws',
      perMessageDeflate: {
        zlibDeflateOptions: {
          chunkSize: 1024,
        },
      },
    });

    this.wss.on('connection', (ws, req) => {
      const clientId = this.generateClientId();
      const client: ConnectedClient = {
        ws,
        lastPing: Date.now(),
        subscriptions: new Set(),
      };
      
      this.clients.set(clientId, client);
      log(`🔌 WebSocket client ${clientId} connected`);

      ws.on('message', (data) => {
        try {
          const message: WebSocketMessage = JSON.parse(data.toString());
          this.handleMessage(clientId, message);
        } catch (error) {
          log(`❌ Invalid WebSocket message from ${clientId}: ${error}`);
        }
      });

      ws.on('close', () => {
        this.clients.delete(clientId);
        this.removeFromAllRooms(clientId);
        log(`🔌 WebSocket client ${clientId} disconnected`);
      });

      ws.on('error', (error) => {
        log(`❌ WebSocket error for ${clientId}: ${error}`);
      });

      ws.on('pong', () => {
        const client = this.clients.get(clientId);
        if (client) {
          client.lastPing = Date.now();
        }
      });

      // Send connection confirmation
      this.sendToClient(clientId, {
        type: 'CONNECTION_ESTABLISHED',
        payload: { clientId },
        timestamp: Date.now(),
      });
    });
  }

  private setupPingPong(): void {
    this.pingInterval = setInterval(() => {
      const now = Date.now();
      this.clients.forEach((client, clientId) => {
        if (client.ws.readyState === client.ws.OPEN) {
          // Check if client is still alive (30 second timeout)
          if (now - client.lastPing > 30000) {
            log(`⚠️ Client ${clientId} timed out, terminating connection`);
            client.ws.terminate();
            this.clients.delete(clientId);
            return;
          }
          client.ws.ping();
        } else {
          this.clients.delete(clientId);
        }
      });
    }, 10000); // Ping every 10 seconds
  }

  private handleMessage(clientId: string, message: WebSocketMessage): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    switch (message.type) {
      case 'SUBSCRIBE_TO_ROOM':
        this.subscribeToRoom(clientId, message.payload.roomId);
        break;
      
      case 'UNSUBSCRIBE_FROM_ROOM':
        this.unsubscribeFromRoom(clientId, message.payload.roomId);
        break;
      
      case 'CHARACTER_GENERATION_START':
        this.handleCharacterGeneration(clientId, message.payload);
        break;
      
      case 'PROJECT_UPDATE':
        this.broadcastToRoom(message.payload.projectId, {
          type: 'PROJECT_UPDATED',
          payload: message.payload,
          timestamp: Date.now(),
        }, clientId);
        break;
      
      default:
        log(`⚠️ Unknown WebSocket message type: ${message.type}`);
    }
  }

  private async handleCharacterGeneration(clientId: string, payload: any): Promise<void> {
    const { projectId, characterData } = payload;
    
    // Subscribe client to character generation updates
    this.subscribeToRoom(clientId, `character-gen-${projectId}`);
    
    // Send progress updates (simulated for now - would integrate with actual AI generation)
    const steps = [
      { step: 'analyzing', progress: 20, message: 'Analyzing character traits...' },
      { step: 'generating', progress: 50, message: 'Generating character details...' },
      { step: 'enhancing', progress: 80, message: 'Enhancing character profile...' },
      { step: 'complete', progress: 100, message: 'Character generation complete!' },
    ];

    for (const stepData of steps) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.broadcastToRoom(`character-gen-${projectId}`, {
        type: 'CHARACTER_GENERATION_PROGRESS',
        payload: stepData,
        timestamp: Date.now(),
      });
    }
  }

  private subscribeToRoom(clientId: string, roomId: string): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    client.subscriptions.add(roomId);
    
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    
    this.rooms.get(roomId)?.add(clientId);
    log(`📡 Client ${clientId} subscribed to room ${roomId}`);
  }

  private unsubscribeFromRoom(clientId: string, roomId: string): void {
    const client = this.clients.get(clientId);
    if (client) {
      client.subscriptions.delete(roomId);
    }
    
    this.rooms.get(roomId)?.delete(clientId);
    log(`📡 Client ${clientId} unsubscribed from room ${roomId}`);
  }

  private removeFromAllRooms(clientId: string): void {
    this.rooms.forEach((clients, roomId) => {
      clients.delete(clientId);
    });
  }

  private sendToClient(clientId: string, message: WebSocketMessage): boolean {
    const client = this.clients.get(clientId);
    if (!client || client.ws.readyState !== client.ws.OPEN) {
      return false;
    }

    try {
      client.ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      log(`❌ Failed to send message to client ${clientId}: ${error}`);
      return false;
    }
  }

  private broadcastToRoom(roomId: string, message: WebSocketMessage, excludeClientId?: string): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    let successCount = 0;
    room.forEach(clientId => {
      if (clientId !== excludeClientId) {
        if (this.sendToClient(clientId, message)) {
          successCount++;
        }
      }
    });

    log(`📡 Broadcasted to room ${roomId}: ${successCount}/${room.size} clients`);
  }

  private generateClientId(): string {
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  }

  /**
   * React 18 SSR Streaming Route Handler
   */
  public setupSSRRoute(component: React.ComponentType<any>): void {
    this.app.get('/modern/*', (req: Request, res: Response) => {
      const url = req.originalUrl;
      
      const { pipe, abort } = renderToPipeableStream(
        React.createElement(component, { url }),
        {
          bootstrapScripts: ['/static/js/main.js'],
          onShellReady() {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            pipe(res);
          },
          onShellError(error) {
            console.error('React SSR Shell Error:', error);
            res.statusCode = 500;
            res.send('<!doctype html><div>Loading...</div>');
          },
          onError(error) {
            console.error('React SSR Stream Error:', error);
          },
        }
      );

      // Abort after 30 seconds
      setTimeout(() => abort(), 30000);
      
      // Abort on client disconnect
      req.on('close', () => abort());
    });
  }

  /**
   * Streaming API endpoint for large datasets (like character lists)
   */
  public setupStreamingAPI(): void {
    this.app.get('/api/stream/characters/:projectId', async (req: Request, res: Response) => {
      const { projectId } = req.params;
      
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      });

      try {
        // This would integrate with your existing storage
        // const characters = await storage.getCharacters(projectId);
        
        // Simulate streaming large dataset
        const mockCharacters = Array.from({ length: 10 }, (_, i) => ({
          id: `char-${i}`,
          name: `Character ${i}`,
          projectId,
        }));

        res.write('{"characters":[');
        
        for (let i = 0; i < mockCharacters.length; i++) {
          if (i > 0) res.write(',');
          res.write(JSON.stringify(mockCharacters[i]));
          
          // Allow other operations to proceed (concurrent processing)
          await new Promise(resolve => setImmediate(resolve));
        }
        
        res.write(']}');
        res.end();
        
        log(`📊 Streamed ${mockCharacters.length} characters for project ${projectId}`);
      } catch (error) {
        res.status(500).json({ error: 'Streaming failed' });
      }
    });
  }

  public getApp(): express.Express {
    return this.app;
  }

  public getServer(): Server {
    return this.server;
  }

  public getWebSocketServer(): WebSocketServer {
    return this.wss;
  }

  public getStats(): object {
    return {
      connectedClients: this.clients.size,
      activeRooms: this.rooms.size,
      totalRoomSubscriptions: Array.from(this.rooms.values())
        .reduce((sum, room) => sum + room.size, 0),
    };
  }

  public cleanup(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
    
    this.clients.forEach((client) => {
      client.ws.close();
    });
    
    this.wss.close();
    this.server.close();
  }
}

export default ModernServer;