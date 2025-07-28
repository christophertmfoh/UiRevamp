// Security Middleware for A-Grade Enterprise Standards
// Implements security headers and protection measures

import { Request, Response, NextFunction } from 'express';

export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // XSS Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // HTTPS enforcement (in production)
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Allow inline scripts for Vite dev
    "style-src 'self' 'unsafe-inline'", // Allow inline styles for Tailwind
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' wss: https:",
  ].join('; '));
  
  // Remove server identification
  res.removeHeader('X-Powered-By');
  
  next();
}

export function rateLimiting() {
  const requests = new Map<string, number[]>();
  const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  const MAX_REQUESTS = 100; // Max 100 requests per window
  
  return (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || 'unknown';
    const now = Date.now();
    
    if (!requests.has(clientId)) {
      requests.set(clientId, []);
    }
    
    const clientRequests = requests.get(clientId)!;
    
    // Remove old requests outside the window
    const validRequests = clientRequests.filter(time => time > now - WINDOW_MS);
    
    if (validRequests.length >= MAX_REQUESTS) {
      return res.status(429).json({ 
        error: 'Too many requests',
        retryAfter: Math.ceil(WINDOW_MS / 1000)
      });
    }
    
    validRequests.push(now);
    requests.set(clientId, validRequests);
    
    next();
  };
}

export function validateApiKey(req: Request, res: Response, next: NextFunction) {
  // Skip validation for auth endpoints
  if (req.path.startsWith('/api/auth/')) {
    return next();
  }
  
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }
  
  // Token validation would happen here
  // For now, just ensure the header format is correct
  next();
}