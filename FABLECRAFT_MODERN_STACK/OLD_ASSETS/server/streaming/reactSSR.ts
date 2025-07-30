import { renderToPipeableStream } from 'react-dom/server';
import React, { Suspense } from 'react';
import type { Request, Response } from 'express';
import { log } from '../vite';

/**
 * React 18 Server-Side Rendering with Streaming Support
 * Optimized for FableCraft creative writing platform
 */

interface SSROptions {
  bootstrapScripts?: string[];
  onShellReady?: () => void;
  onAllReady?: () => void;
  onShellError?: (error: Error) => void;
  onError?: (error: Error) => void;
  timeout?: number;
}

interface StreamingData {
  initialData?: any;
  userContext?: any;
  projectData?: any;
}

/**
 * Enhanced SSR renderer with React 18 streaming capabilities
 */
export class ReactSSRRenderer {
  private static instance: ReactSSRRenderer;

  public static getInstance(): ReactSSRRenderer {
    if (!ReactSSRRenderer.instance) {
      ReactSSRRenderer.instance = new ReactSSRRenderer();
    }
    return ReactSSRRenderer.instance;
  }

  /**
   * Render React component with streaming SSR
   */
  public renderToStream(
    component: React.ComponentType<any>,
    req: Request,
    res: Response,
    options: SSROptions = {},
    streamingData: StreamingData = {}
  ): void {
    const {
      bootstrapScripts = ['/static/js/main.js'],
      timeout = 30000,
    } = options;

    const url = req.originalUrl;
    const startTime = Date.now();

    // Prepare initial data for hydration
    const initialDataScript = streamingData.initialData
      ? `window.__INITIAL_DATA__ = ${JSON.stringify(streamingData.initialData)};`
      : '';

    const { pipe, abort } = renderToPipeableStream(
      React.createElement(
        ErrorBoundary,
        null,
        React.createElement(
          Suspense,
          { fallback: React.createElement(StreamingFallback) },
          React.createElement(component, { url, ...streamingData })
        )
      ),
      {
        bootstrapScripts,
        bootstrapScriptContent: initialDataScript,
        onShellReady() {
          const shellTime = Date.now() - startTime;
          log(`⚡ React shell ready in ${shellTime}ms for ${url}`);
          
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('X-Powered-By', 'React 18 SSR Streaming');
          
          pipe(res);
          
          options.onShellReady?.();
        },
        onAllReady() {
          const totalTime = Date.now() - startTime;
          log(`✅ React SSR complete in ${totalTime}ms for ${url}`);
          options.onAllReady?.();
        },
        onShellError(error) {
          const err = error as Error;
          log(`❌ React SSR shell error for ${url}: ${err.message}`);
          
          res.statusCode = 500;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.send(this.getErrorFallback(err));
          
          options.onShellError?.(err);
        },
        onError(error) {
          const err = error as Error;
          log(`⚠️ React SSR stream error for ${url}: ${err.message}`);
          options.onError?.(err);
        },
      }
    );

    // Handle client disconnect
    req.on('close', () => {
      log(`🔌 Client disconnected during SSR for ${url}`);
      abort();
    });

    // Timeout handling
    const timeoutId = setTimeout(() => {
      log(`⏰ SSR timeout (${timeout}ms) for ${url}`);
      abort();
    }, timeout);

    res.on('finish', () => {
      clearTimeout(timeoutId);
    });
  }

  /**
   * Render specific FableCraft components with optimized streaming
   */
  public renderCharacterPage(req: Request, res: Response, characterData: any): void {
    this.renderToStream(
      CharacterPageSSR,
      req,
      res,
      {
        bootstrapScripts: ['/static/js/character-bundle.js', '/static/js/main.js'],
        timeout: 15000, // Shorter timeout for character pages
      },
      {
        initialData: { character: characterData },
        userContext: req.user,
      }
    );
  }

  public renderProjectPage(req: Request, res: Response, projectData: any): void {
    this.renderToStream(
      ProjectPageSSR,
      req,
      res,
      {
        bootstrapScripts: ['/static/js/project-bundle.js', '/static/js/main.js'],
        timeout: 20000,
      },
      {
        initialData: { project: projectData },
        userContext: req.user,
      }
    );
  }

  public renderWorldBiblePage(req: Request, res: Response, worldData: any): void {
    this.renderToStream(
      WorldBiblePageSSR,
      req,
      res,
      {
        bootstrapScripts: ['/static/js/world-bible-bundle.js', '/static/js/main.js'],
        timeout: 25000, // Longer timeout for complex world bible
      },
      {
        initialData: { world: worldData },
        userContext: req.user,
      }
    );
  }

  private getErrorFallback(error: Error): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>FableCraft - Loading</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              margin: 0; 
              padding: 40px; 
              background: #0f0f23; 
              color: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
            }
            .loading-container {
              text-align: center;
              max-width: 400px;
            }
            .spinner {
              border: 2px solid #333;
              border-top: 2px solid #00ff88;
              border-radius: 50%;
              width: 40px;
              height: 40px;
              animation: spin 1s linear infinite;
              margin: 0 auto 20px;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            h1 { color: #00ff88; margin-bottom: 10px; }
            p { color: #cccccc; line-height: 1.5; }
          </style>
        </head>
        <body>
          <div class="loading-container">
            <div class="spinner"></div>
            <h1>FableCraft</h1>
            <p>Loading your creative writing platform...</p>
            <p><small>If this takes too long, please refresh the page.</small></p>
          </div>
          <script>
            // Fallback client-side rendering if SSR fails
            setTimeout(() => {
              if (!window.__REACT_LOADED__) {
                window.location.reload();
              }
            }, 5000);
          </script>
        </body>
      </html>
    `;
  }
}

/**
 * Error Boundary for SSR
 */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    log(`❌ React SSR Error Boundary: ${error.message}`);
  }

  render() {
    if (this.state.hasError) {
      return React.createElement(ErrorFallback, { error: this.state.error });
    }

    return this.props.children;
  }
}

/**
 * Streaming fallback component
 */
const StreamingFallback: React.FC = () => {
  return React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      color: '#cccccc',
    }
  }, 'Loading FableCraft...');
};

/**
 * Error fallback component
 */
const ErrorFallback: React.FC<{ error?: Error }> = ({ error }) => {
  return React.createElement('div', {
    style: {
      padding: '20px',
      textAlign: 'center',
      color: '#ff6b6b',
    }
  }, `Something went wrong: ${error?.message || 'Unknown error'}`);
};

/**
 * SSR Components for FableCraft pages
 * These would be actual implementations of your pages optimized for SSR
 */

const CharacterPageSSR: React.FC<any> = (props) => {
  return React.createElement('div', null, 
    React.createElement('h1', null, 'Character Management'),
    React.createElement('div', null, 'Loading character data...')
  );
};

const ProjectPageSSR: React.FC<any> = (props) => {
  return React.createElement('div', null,
    React.createElement('h1', null, 'Project Management'),
    React.createElement('div', null, 'Loading project data...')
  );
};

const WorldBiblePageSSR: React.FC<any> = (props) => {
  return React.createElement('div', null,
    React.createElement('h1', null, 'World Bible'),
    React.createElement('div', null, 'Loading world data...')
  );
};

export const ssrRenderer = ReactSSRRenderer.getInstance();